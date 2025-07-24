// src/home/HomePageUI.jsx
import { Box, Grid, Alert, useTheme } from "@mui/material";

import Timer from "./components/Timer";
import FocusSetup from "./components/FocusSetup";

const HomePageUI = ({
  user,
  onFocusTargetsChange,
  onTimerComplete,
  selectedTaskId,
  pageError,
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
        p: { xs: 1, sm: 2, md: 3 },
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
            // --- THEMATIC PANEL STYLES ---
            bgcolor: "background.paper",
            borderRadius: 3,
            border: `2px solid ${theme.palette.primary[800]}`,
            boxShadow: `0px 0px 10px 2px ${theme.palette.accent.main}`,
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
            position: "relative",
            // Styles moved here from the inner Box
            bgcolor: "background.paper",
            borderRadius: 3,
            border: `2px solid ${theme.palette.primary[800]}`,
            boxShadow: `0px 0px 10px 2px ${theme.palette.accent.main}`,
            maxHeight: "100%",
          }}
        >
          {pageError && !theme.palette.mode && (
            <Alert
              severity="error"
              sx={{
                mb: 2,
                position: "absolute",
                top: "10px",
                width: "auto",
              }}
            >
              {pageError}
            </Alert>
          )}
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
