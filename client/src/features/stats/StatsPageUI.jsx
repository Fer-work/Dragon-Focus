// src/features/stats/components/StatsPageUI.jsx
import { useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
  Grid,
  Tabs,
  Tab,
  useTheme,
  Paper,
} from "@mui/material";

import StatCard from "./components/StatCard";
import FocusTimelineChart from "./components/FocusTimeLineChart";
// You might create this component next!
// import ProjectBreakdownChart from './ProjectBreakdownChart';
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AvTimerIcon from "@mui/icons-material/AvTimer";
import "../../styles/index.css";

// A simple helper component for Tab Panels
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const StatsPageUI = ({
  isLoading,
  error,
  stats,
  selectedPeriod,
  onPeriodChange,
}) => {
  const theme = useTheme();
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    console.log("selected Period: ", selectedPeriod);

    setCurrentTab(newValue);
  };

  if (isLoading && stats.sessionCount === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  console.log(stats);

  return (
    <Box sx={{ width: "100%", height: "100%", p: { xs: 1, sm: 2 } }}>
      {/* We use a single Paper component as our main panel. */}
      <Paper
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: { xs: 2, md: 3 },
          p: { xs: 2, sm: 3 },
          overflowY: "auto", // This makes the *panel's content* scrollable, not the whole page.

          // --- THEMATIC PANEL STYLES from HomePageUI ---
          bgcolor: "background.paper",
          borderRadius: 3,
          border: `2px solid ${theme.palette.primary.main}`,
          boxShadow: `0px 0px 5px 2px ${theme.palette.accent.main}`,
        }}
      >
        {/* <Typography
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
      </Typography> */}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <ToggleButtonGroup
          value={selectedPeriod}
          exclusive
          onChange={(event, newPeriod) => {
            if (newPeriod !== null) {
              // Prevents unselecting everything
              onPeriodChange(newPeriod);
            }
          }}
          aria-label="time period"
          fullWidth
          color="primary" // The selected button will use the primary color
        >
          <ToggleButton value="today" aria-label="today">
            Today
          </ToggleButton>
          <ToggleButton value="week" aria-label="today">
            Week
          </ToggleButton>
          <ToggleButton value="month" aria-label="today">
            Month
          </ToggleButton>
          <ToggleButton value="all" aria-label="today">
            All
          </ToggleButton>
        </ToggleButtonGroup>

        {/* Stat Cards Section */}
        {stats.sessionCount > 0 ? (
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={4} md="auto">
              <StatCard
                title="Total Focus Time"
                value={stats.totalMinutes}
                unit="min"
                icon={<AccessTimeIcon />}
              />
            </Grid>
            <Grid item xs={12} sm={4} md="auto">
              <StatCard
                title="Sessions Completed"
                value={stats.sessionCount}
                unit="sessions"
                icon={<CheckCircleOutlineIcon />}
              />
            </Grid>
            <Grid item xs={12} sm={4} md="auto">
              <StatCard
                title="Avg. Session Length"
                value={Math.round(stats.totalMinutes / stats.sessionCount) || 0}
                unit="min"
                icon={<AvTimerIcon />}
              />
            </Grid>
          </Grid>
        ) : (
          <Typography sx={{ textAlign: "center", my: 2 }}>
            No data for this period. Time to focus!
          </Typography>
        )}
        {/* Charts Section */}
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              aria-label="stats charts tabs"
              centered
            >
              <Tab label="Focus Timeline" />
              <Tab label="Project Breakdown" disabled />
            </Tabs>
          </Box>
          <TabPanel value={currentTab} index={0}>
            <FocusTimelineChart
              data={stats.timelineData}
              isLoading={isLoading}
              periodLabel={selectedPeriod}
            />
          </TabPanel>
          <TabPanel value={currentTab} index={1}>
            {/* Placeholder for the next chart */}
          </TabPanel>
        </Box>
      </Paper>
    </Box>
  );
};

export default StatsPageUI;
