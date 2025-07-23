// src/features/stats/StatsPage.jsx
import { Box, Typography } from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import useUser from "../../globalHooks/useUser";
import {
  filterSessionsForToday,
  filterSessionsForThisWeek,
  filterSessionsForThisMonth,
  calculateTotalMinutes,
  countSessions,
  prepareTimelineData, // We'll use this later for charts
  aggregateTimeByProject, // We'll use this later for charts
} from "./hooks/statsProcessor/"; // Ensure this path is correct
import StatsPageUI from "./StatsPageUI";

const StatsPage = () => {
  const { user } = useUser();
  const [allSessions, setAllSessions] = useState([]);
  const [processedStats, setProcessedStats] = useState({
    totalMinutes: 0,
    sessionCount: 0,
    timelineData: [],
    projectData: [],
  });
  const [selectedPeriod, setSelectedPeriod] = useState("today");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    if (allSessions.length > 0) {
      let filteredSessions = [];
      switch (selectedPeriod) {
        case "today":
          filteredSessions = filterSessionsForToday(allSessions);
          break;
        case "week":
          filteredSessions = filterSessionsForThisWeek(allSessions);
          break;
        case "month":
          filteredSessions = filterSessionsForThisMonth(allSessions);
          break;
        case "all":
        default:
          filteredSessions = allSessions;
          break;
      }
      const totalMinutes = calculateTotalMinutes(filteredSessions);
      const sessionCount = countSessions(filteredSessions);
      const timelineData = prepareTimelineData(
        filteredSessions,
        selectedPeriod === "today" ? 24 : 7
      ); // Example
      const projectData = aggregateTimeByProject(filteredSessions);

      setProcessedStats({
        totalMinutes,
        sessionCount,
        timelineData,
        projectData,
      });
    } else {
      // Reset stats if no sessions
      setProcessedStats({
        totalMinutes: 0,
        sessionCount: 0,
        timelineData: [],
        projectData: [],
      });
    }
  }, [allSessions, selectedPeriod]);

  if (!user) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h5" color="text.secondary">
          Please log in to view your stats.
        </Typography>
      </Box>
    );
  }

  return (
    <StatsPageUI
      isLoading={isLoading}
      error={error}
      stats={processedStats}
      selectedPeriod={selectedPeriod}
      onPeriodChange={setSelectedPeriod}
    />
  );
};

export default StatsPage;
