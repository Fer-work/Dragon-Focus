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
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  if (isLoading && stats.sessionCount === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
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

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* --- LEFT COLUMN: SUMMARY --- */}
        <Grid item xs={12} md={3} m={"auto"}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
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
              <ToggleButton value="today" aria-label="today">
                Week
              </ToggleButton>
              <ToggleButton value="today" aria-label="today">
                Month
              </ToggleButton>
              <ToggleButton value="today" aria-label="today">
                All
              </ToggleButton>
            </ToggleButtonGroup>

            {stats.sessionCount > 0 ? (
              <>
                <StatCard
                  title="Total Focus Time"
                  value={stats.totalMinutes}
                  unit="min"
                  icon={<AccessTimeIcon />}
                />
                <StatCard
                  title="Sessions Completed"
                  value={stats.sessionCount}
                  unit="sessions"
                  icon={<CheckCircleOutlineIcon />}
                />
                <StatCard
                  title="Avg. Session Length"
                  value={
                    Math.round(stats.totalMinutes / stats.sessionCount) || 0
                  }
                  unit="min"
                  icon={<AvTimerIcon />}
                />
              </>
            ) : (
              <Typography sx={{ textAlign: "center", mt: 4 }}>
                No data for this period. Time to focus!
              </Typography>
            )}
          </Box>
        </Grid>

        {/* --- RIGHT COLUMN: DETAILED CHARTS (TABS) --- */}
        <Grid item xs={12} md={9} m={"auto"} justifyContent={"center"}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }} m="auto">
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              aria-label="stats charts tabs"
            >
              <Tab label="Focus Timeline" />
              <Tab label="Project Breakdown" />
            </Tabs>
          </Box>
          <TabPanel value={currentTab} index={0}>
            <Typography variant="h5" gutterBottom>
              Focus Over Time
            </Typography>
            <FocusTimelineChart
              data={stats.timelineData}
              isLoading={isLoading}
              periodLabel={selectedPeriod}
            />
          </TabPanel>
          <TabPanel value={currentTab} index={1}>
            <Typography variant="h5" gutterBottom>
              Time per Project
            </Typography>
            {/* You would add your ProjectBreakdownChart component here, passing it stats.projectData */}
            <Typography color="text.secondary">
              Project breakdown chart coming soon!
            </Typography>
          </TabPanel>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StatsPageUI;
