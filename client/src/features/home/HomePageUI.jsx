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
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
        }}
      >
        {/* Left Column: Focus Setup - This is clean, no changes needed. */}
        <Grid
          item
          xs={12}
          md={5}
          lg={4}
          sx={{
            display: "flex",
            flex: 1,
            width: "100%",
            height: "100%",
          }}
        >
          <FocusSetup user={user} onFocusTargetsChange={onFocusTargetsChange} />
        </Grid>

        {/* Right Column: Timer */}
        <Grid
          item
          xs={12}
          md={7}
          lg={8}
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 2,
            height: "100%",
          }}
        >
          <Box
            sx={{
              bgcolor: "background.paper", // CORRECT: Uses the theme's paper color.
              borderRadius: 3,
              // --- REVISED: Aligned with the panelStyles from Layout.jsx ---
              boxShadow: theme.shadows[5], // Using theme's shadow ramp.
              border: `2px solid ${theme.palette.divider}`, // Using theme's divider color.
              // --- End of revisions ---
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {pageError && !theme.palette.mode && (
              <Alert
                severity="error"
                sx={{
                  mb: 2,
                  position: "absolute",
                  top: "10px",
                  width: "calc(100% - 40px)",
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
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomePageUI;
