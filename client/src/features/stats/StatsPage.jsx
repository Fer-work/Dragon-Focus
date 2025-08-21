// src/features/stats/StatsPage.jsx

import { Box, Typography, CircularProgress } from "@mui/material";
import { useState, useEffect, useCallback, useMemo } from "react";
import apiClient from "../../api/apiClient";
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
import { useNotification } from "../../globalHooks/NotificationContext";
import StatsPageUI from "./StatsPageUI";

const StatsPage = () => {
  const { showNotification } = useNotification();
  const { user } = useUser();

  // Raw data and loading state
  const [allSessions, setAllSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("today");

  // Data Fetching
  const fetchAllSessions = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const response = await apiClient.get("/sessions");
      setAllSessions(response.data || []);
      console.log("setAllSessions ", response.data);
    } catch (err) {
      console.error("Failed to fetch sessions:", err);
      showNotification(
        err.response?.data?.message || "Failed to load session data.",
        "error"
      );
      setAllSessions([]);
    } finally {
      setIsLoading(false);
    }
  }, [user, showNotification]);

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

  // 3. Memoize the final stat calculations. This recalculates only when the filtered list changes.
  const processedStats = useMemo(() => {
    if (filteredSessions.length === 0) {
      return {
        totalMinutes: 0,
        sessionCount: 0,
        timelineData: [],
        categoryData: [],
      };
    }

    return {
      totalMinutes: calculateTotalMinutes(filteredSessions),
      sessionCount: countSessions(filteredSessions),
      timelineData: prepareTimelineData(filteredSessions, selectedPeriod),
      categoryData: aggregateTimeByCategory(filteredSessions),
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
      stats={processedStats}
      selectedPeriod={selectedPeriod}
      onPeriodChange={setSelectedPeriod}
    />
  );
};

export default StatsPage;
