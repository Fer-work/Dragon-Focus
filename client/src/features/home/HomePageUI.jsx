// src/home/HomePageUI.jsx
import { Box, Grid, useTheme } from "@mui/material";

import Timer from "./components/Timer";
import FocusSetup from "./components/FocusSetup";

const HomePageUI = ({
  user,
  onFocusTargetsChange,
  onTimerComplete,
  selectedTaskId,
  pomodoroDuration,
  shortBreak,
  longBreak,
  longBreakInterval,
}) => {
  const theme = useTheme();

  return (
    // This outer Box is perfect. It correctly uses theme defaults. No changes needed.
    <Box
      sx={{
        width: "100%",
        height: "100%",
        p: { xs: 1, sm: 2 },
        color: "text.primary",
      }}
    >
      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ height: "100%" }}>
        {/* Left Column: Focus Setup - This is clean, no changes needed. */}
        <Grid
          size={{
            xs: 12, // On extra-small screens, takes up 12/12 columns
            md: 5, // On medium screens and up, takes up 5/12 columns
            lg: 4, // On large screens and up, takes up 4/12 columns
          }}
          sx={{
            bgcolor: "background.paper",
            borderRadius: 3,
            border: `2px solid ${theme.palette.primary.main}`,
            boxShadow: `0px 0px 5px 2px ${theme.palette.accent.main}`,
            maxHeight: "100%",
          }}
        >
          <FocusSetup user={user} onFocusTargetsChange={onFocusTargetsChange} />
        </Grid>

        {/* Right Column: Timer */}
        <Grid
          size={{
            xs: 12,
            md: 7,
            lg: 8,
          }}
          sx={{
            bgcolor: "background.paper",
            borderRadius: 3,
            border: `2px solid ${theme.palette.primary.main}`,
            boxShadow: `0px 0px 5px 2px ${theme.palette.accent.main}`,
            maxHeight: "100%",
          }}
        >
          <Timer
            key={selectedTaskId}
            pomodoroDuration={pomodoroDuration}
            shortBreakDuration={shortBreak}
            longBreakDuration={longBreak}
            longBreakInterval={longBreakInterval}
            onTimerComplete={onTimerComplete}
            disabled={!selectedTaskId}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomePageUI;
