import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
  ButtonGroup,
  Grid,
} from "@mui/material";
import useUser from "../utils/useUser";
import {
  filterSessionsForToday,
  filterSessionsForThisWeek,
  filterSessionsForThisMonth,
  calculateTotalMinutes,
  countSessions,
  prepareTimelineData, // We'll use this later for charts
  aggregateTimeByProject, // We'll use this later for charts
} from "../utils/statsProcessor/"; // Ensure this path is correct
import StatCard from "./StatCard";
// Optional: Import icons if you want to use them
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AvTimerIcon from "@mui/icons-material/AvTimer";
import FocusTimelineChart from "./FocusTimeLineChart";
import "../styles/index.css";

const StatsPage = () => {
  const { user } = useUser();
  const [allSessions, setAllSessions] = useState([]);
  const [processedStats, setProcessedStats] = useState({
    totalMinutes: 0,
    sessionCount: 0,
    // We'll add more specific stats here, like timelineData, projectData
  });
  const [selectedPeriod, setSelectedPeriod] = useState("today"); // 'today', 'week', 'month', 'all'
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
      setProcessedStats({ totalMinutes: 0, sessionCount: 0 });
    }
  }, [allSessions, selectedPeriod]);

  if (!user && !isLoading) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h5" color="text.secondary">
          Please log in to view your stats.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, width: "100%" }}>
      <Typography
        variant="h2"
        component="h1"
        gutterBottom
        sx={{
          color: "primary.main",
          textAlign: "center",
          fontWeight: "bold",
          mb: 3,
        }}
      >
        📈 Your Focus Stats 📉
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <ButtonGroup
          variant="outlined"
          aria-label="outlined primary button group"
        >
          <Button
            onClick={() => setSelectedPeriod("today")}
            disabled={isLoading}
            variant={selectedPeriod === "today" ? "contained" : "outlined"}
          >
            Today
          </Button>
          <Button
            onClick={() => setSelectedPeriod("week")}
            disabled={isLoading}
            variant={selectedPeriod === "week" ? "contained" : "outlined"}
          >
            This Week
          </Button>
          <Button
            onClick={() => setSelectedPeriod("month")}
            disabled={isLoading}
            variant={selectedPeriod === "month" ? "contained" : "outlined"}
          >
            This Month
          </Button>
          <Button
            onClick={() => setSelectedPeriod("all")}
            disabled={isLoading}
            variant={selectedPeriod === "all" ? "contained" : "outlined"}
          >
            All Time
          </Button>
        </ButtonGroup>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Focus Time"
            value={processedStats.totalMinutes}
            unit="min"
            loading={isLoading && allSessions.length === 0}
            icon={<AccessTimeIcon />} // Example with icon
            cardColor="primary" // Example with a themed background
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Sessions Completed"
            value={processedStats.sessionCount}
            unit="sessions"
            loading={isLoading && allSessions.length === 0}
            icon={<CheckCircleOutlineIcon />}
            cardColor="secondary"
          />
        </Grid>
        {/* Add more StatCard components here as needed, e.g., average session length */}
        {processedStats.sessionCount > 0 && (
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Avg. Session Length"
              value={
                Math.round(
                  processedStats.totalMinutes / processedStats.sessionCount
                ) || 0
              }
              unit="min"
              loading={isLoading && allSessions.length === 0}
              icon={<AvTimerIcon />}
              cardColor="accent"
            />
          </Grid>
        )}
      </Grid>

      {isLoading &&
        allSessions.length === 0 && ( // Show main loader only on initial load
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress size={40} />
            <Typography></Typography>
          </Box>
        )}

      {!isLoading && allSessions.length === 0 && !error && (
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ textAlign: "center", mt: 4 }}
        >
          No focus sessions recorded yet for this period. Time to get started!
        </Typography>
      )}

      {/* Placeholder for Charts Section */}
      <Box sx={{ mt: 4 }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ color: "accent.main", textAlign: "center", mb: 2 }}
        >
          Focus Timeline (
          {selectedPeriod === "today"
            ? "Today (by hour - placeholder)"
            : selectedPeriod === "week"
            ? "Last 7 Days"
            : "This Month (by day - placeholder)"}
          )
        </Typography>
        {processedStats.timelineData &&
        processedStats.timelineData.length > 0 ? (
          <FocusTimelineChart
            data={processedStats.timelineData}
            loading={isLoading && allSessions.length === 0} // Or a more specific loading for chart data if processing is heavy
            periodLabel={selectedPeriod}
          />
        ) : (
          !isLoading && (
            <Typography color="text.secondary">
              Not enough data for timeline chart.
            </Typography>
          )
        )}
      </Box>
    </Box>
  );
};

export default StatsPage;
