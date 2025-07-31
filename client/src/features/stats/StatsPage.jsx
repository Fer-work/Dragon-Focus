// src/features/stats/StatsPage.jsx
import { differenceInDays } from "date-fns";

import { Box, Typography, CircularProgress } from "@mui/material";
import { useState, useEffect, useCallback, useMemo } from "react";
import axios, { all } from "axios";
import useUser from "../../globalHooks/useUser";
import {
  filterSessionsForToday,
  filterSessionsForThisWeek,
  filterSessionsForThisMonth,
  calculateTotalMinutes,
  countSessions,
  prepareTimelineData, // We'll use this later for charts
  aggregateTimeByCategory, // We'll use this later for charts
} from "./hooks/statsProcessor/"; // Ensure this path is correct
import StatsPageUI from "./StatsPageUI";

// A small helper function to calculate the days for the 'all' period
const getDaysInPeriod = (sessions) => {
  if (sessions.length < 2) return 1;
  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  );
  const firstDay = new Date(sortedSessions[0].timestamp);
  const lastDay = new Date(sortedSessions[sortedSessions.length - 1].timestamp);
  return differenceInDays(lastDay, firstDay) + 1;
};

const StatsPage = () => {
  const { user } = useUser();

  // Raw data and loading state
  const [allSessions, setAllSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("today");

  // Data Fetching
  const fetchAllSessions = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const token = await user.getIdToken();
      const response = await axios.get("/api/sessions", {
        headers: { authtoken: token },
      });
      setAllSessions(response.data || []);
      console.log("setAllSessions ", response.data);
    } catch (err) {
      console.error("Failed to fetch sessions:", err);
      setError(err.response?.data?.message || "Failed to load session data.");
      setAllSessions([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAllSessions();
  }, [fetchAllSessions]);

  // 2. Memoize the filtered sessions list. This recalculates only when allSessions or selectedPeriod changes.
  const filteredSessions = useMemo(() => {
    console.log("Selected period: ", selectedPeriod);
    switch (selectedPeriod) {
      case "today":
        return filterSessionsForToday(allSessions);
      case "week":
        return filterSessionsForThisWeek(allSessions);
      case "month":
        return filterSessionsForThisMonth(allSessions);
      case "all":
      default:
        return allSessions;
    }
  }, [allSessions, selectedPeriod]);

  console.log("Filtered Sessions: ", filteredSessions);

  // 3. Memoize the final stat calculations. This recalculates only when the filtered list changes.
  const processedStats = useMemo(() => {
    if (filteredSessions.length === 0) {
      return {
        totalMinutes: 0,
        sessionCount: 0,
        timelineData: [],
        projectData: [],
      };
    }

    // --- Key Fix: Make the numberOfDays dynamic ---
    let numberOfDays;
    switch (selectedPeriod) {
      case "today":
        numberOfDays = 1;
        break;
      case "week":
        numberOfDays = 7;
        break;
      case "month":
        numberOfDays = 30;
        break;
      case "all":
        numberOfDays = getDaysInPeriod(filteredSessions);
        break;
      default:
        numberOfDays = 7;
    }

    return {
      totalMinutes: calculateTotalMinutes(filteredSessions),
      sessionCount: countSessions(filteredSessions),
      timelineData: prepareTimelineData(filteredSessions, numberOfDays),
      projectData: aggregateTimeByCategory(filteredSessions),
    };
  }, [filteredSessions, selectedPeriod]);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h5" color="text.secondary">
          Please log in to view your stats.
        </Typography>
      </Box>
    );
  }

  console.log("selected Period: ", selectedPeriod);

  return (
    <StatsPageUI
      error={error}
      stats={processedStats}
      selectedPeriod={selectedPeriod}
      onPeriodChange={setSelectedPeriod}
    />
  );
};

export default StatsPage;
