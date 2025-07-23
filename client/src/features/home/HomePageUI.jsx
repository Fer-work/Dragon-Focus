// src/home/HomePageUI.jsx
import {
  Box,
  Grid,
  Alert, // For page-level errors if FocusSetup doesn't handle all
  useTheme,
} from "@mui/material";

import Timer from "./components/Timer";
import FocusSetup from "./components/FocusSetup";

import "../../styles/home.css";

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
          flexDirection: "row", // Default for container
        }}
      >
        {/* Left Column: Focus Setup */}
        <Grid
          item
          xs={12}
          md={5}
          lg={4}
          sx={{
            display: "flex",
            flex: 1, // Let Grid sizing handle this
            width: "100%", // Ensure it takes space
            height: "100%", // Or adjust as needed; 'auto' might be better if content drives height
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
            // flex: 2, // Let Grid sizing handle this
            display: "flex",
            flexDirection: "column",
            flex: 2,
            height: "100%",
          }}
        >
          <Box
            sx={{
              bgcolor: "background.paper",
              borderRadius: 3,
              boxShadow: "0px 5px 15px rgba(0,0,0,0.3)",
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              border: (theme) => `2px solid ${theme.palette.neutral[500]}`,
            }}
          >
            {pageError &&
              !theme.palette.mode && ( // Only show general page errors if FocusSetup doesn't show its own for the same thing
                <Alert
                  severity="error"
                  sx={{
                    mb: 2,
                    position: "absolute",
                    top: "10px",
                    width: "calc(100% - 40px)" /* Adjust based on padding */,
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
