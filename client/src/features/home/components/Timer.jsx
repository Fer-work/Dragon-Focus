import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Button, Typography, useTheme, ButtonGroup } from "@mui/material";
import { SettingsContext } from "../../features/stats/hooks/SettingsContext";

// Optional: Icons for buttons
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import ReplayIcon from "@mui/icons-material/Replay";
import TimerIcon from "@mui/icons-material/Timer"; // For Pomodoro
import FreeBreakfastIcon from "@mui/icons-material/FreeBreakfast"; // For Breaks

export default function Timer({
  onTimerComplete,
  disabled: timerDisabledProp,
}) {
  const { pomodoroDuration, shortBreakDuration, longBreakDuration } =
    useContext(SettingsContext);
  const theme = useTheme();

  const [secondsLeft, setSecondsLeft] = useState(pomodoroDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [currentSession, setCurrentSession] = useState("pomodoro");
  const intervalRef = useRef(null);

  // Effect to update timer when active session, durations, or isRunning state changes
  useEffect(() => {
    let newDuration;
    switch (currentSession) {
      case "pomodoro":
        newDuration = pomodoroDuration * 60;
        break;
      case "shortBreak":
        newDuration = shortBreakDuration * 60;
        break;
      case "longBreak":
        newDuration = longBreakDuration * 60;
        break;
      default:
        newDuration = pomodoroDuration * 60;
        break;
    }
    setSecondsLeft(newDuration);

    // If the session type changes OR if isRunning becomes false externally (e.g. timer completes),
    // ensure the timer is stopped and isRunning state is false.
    if (isRunning) {
      // Only act if it was previously running and now needs to stop due to session change
      // This specific 'if (isRunning)' block's purpose is to stop the timer
      // when currentSession or durations change WHILE it was running.
      // The primary stopping logic is in the second useEffect.
      // However, if currentSession changes, we want to reset isRunning.
      clearInterval(intervalRef.current);
      setIsRunning(false);
    }
  }, [
    currentSession,
    pomodoroDuration,
    shortBreakDuration,
    longBreakDuration,
    isRunning,
  ]); // Added isRunning to dependency array

  // Effect to run the timer logic
  useEffect(() => {
    if (isRunning && !timerDisabledProp) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            let completedSessionDuration = 0;
            // Determine duration based on the session type that just ENDED
            switch (currentSession) {
              case "pomodoro":
                completedSessionDuration = pomodoroDuration * 60;
                break;
              case "shortBreak":
                completedSessionDuration = shortBreakDuration * 60;
                break;
              case "longBreak":
                completedSessionDuration = longBreakDuration * 60;
                break;
              default:
                completedSessionDuration = pomodoroDuration * 60;
            }
            onTimerComplete?.(completedSessionDuration);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [
    isRunning,
    onTimerComplete,
    timerDisabledProp,
    currentSession, // currentSession is needed here for the switch case in onTimerComplete
    pomodoroDuration, // Needed for onTimerComplete
    shortBreakDuration, // Needed for onTimerComplete
    longBreakDuration, // Needed for onTimerComplete
  ]);

  const toggleTimer = () => {
    if (timerDisabledProp && !isRunning) return; // Prevent starting if disabled
    if (timerDisabledProp && isRunning) {
      // Allow pausing even if disabled
      setIsRunning(false);
      return;
    }
    setIsRunning((prev) => !prev);
  };

  const resetTimer = () => {
    // Allow reset if timer is running OR if it's not disabled
    if (!isRunning && timerDisabledProp) return;

    clearInterval(intervalRef.current);
    let newDuration;
    switch (currentSession) {
      case "pomodoro":
        newDuration = pomodoroDuration * 60;
        break;
      case "shortBreak":
        newDuration = shortBreakDuration * 60;
        break;
      case "longBreak":
        newDuration = longBreakDuration * 60;
        break;
      default:
        newDuration = pomodoroDuration * 60;
        break;
    }
    setSecondsLeft(newDuration);
    setIsRunning(false);
  };

  const changeSession = (sessionType) => {
    if (isRunning) return; // Do not allow changing session type while timer is running
    if (timerDisabledProp && sessionType !== currentSession) return;
    setCurrentSession(sessionType);
    // isRunning will be set to false by the first useEffect when currentSession changes
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const getSessionButtonStyle = (sessionName) => ({
    flexGrow: 1,
    color:
      currentSession === sessionName
        ? theme.palette.getContrastText(theme.palette.primary.main)
        : theme.palette.text.secondary,
    borderColor:
      currentSession === sessionName
        ? theme.palette.primary.dark // Active border
        : theme.palette.neutral[theme.palette.mode === "dark" ? 600 : 300], // Inactive border
    backgroundColor:
      currentSession === sessionName
        ? theme.palette.primary.main
        : "transparent",
    "&:hover": {
      backgroundColor:
        currentSession === sessionName
          ? theme.palette.primary.dark
          : theme.palette.action.hover,
      borderColor:
        currentSession === sessionName
          ? theme.palette.primary.dark
          : theme.palette.primary.light,
    },
    "&.Mui-disabled": {
      // Style for when ButtonGroup is disabled
      borderColor: theme.palette.action.disabledBackground,
    },
  });

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-around",
        p: { xs: 2, sm: 3 },
      }}
    >
      {/* Session Type Buttons */}
      <ButtonGroup
        variant="outlined" // Base variant, active button will override to contained
        aria-label="session type button group"
        fullWidth
        sx={{ mb: 3 }}
        disabled={isRunning || timerDisabledProp} // Disable changing session type while running OR if globally disabled
      >
        <Button
          variant={currentSession === "pomodoro" ? "contained" : "outlined"}
          onClick={() => changeSession("pomodoro")}
          startIcon={<TimerIcon />}
          sx={getSessionButtonStyle("pomodoro")}
        >
          Pomodoro
        </Button>
        <Button
          variant={currentSession === "shortBreak" ? "contained" : "outlined"}
          onClick={() => changeSession("shortBreak")}
          startIcon={<FreeBreakfastIcon />}
          sx={getSessionButtonStyle("shortBreak")}
        >
          Short Break
        </Button>
        <Button
          variant={currentSession === "longBreak" ? "contained" : "outlined"}
          onClick={() => changeSession("longBreak")}
          startIcon={<FreeBreakfastIcon sx={{ transform: "scale(1.2)" }} />}
          sx={getSessionButtonStyle("longBreak")}
        >
          Long Break
        </Button>
      </ButtonGroup>

      {/* Timer Display */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: { xs: "240px", sm: "300px", md: "360px" }, // Slightly adjusted for potentially larger digits
          height: { xs: "240px", sm: "300px", md: "360px" },
          bgcolor:
            theme.palette.mode === "dark"
              ? theme.palette.neutral[900] // Very Dark (almost black)
              : theme.palette.neutral[100], // Very Light Jade/Stone White
          border: `4px solid ${theme.palette.primary.main}`, // Green for light, Orange for dark
          borderRadius: "50%",
          boxShadow:
            theme.palette.mode === "dark"
              ? `0 0 20px ${theme.palette.primary.light}, 0 0 30px ${theme.palette.accent.main} inset` // Dark mode glow
              : `0 0 20px ${theme.palette.primary.light}, 0 0 30px ${theme.palette.primary.light} inset`, // Light mode glow (green based)
          my: 2,
          position: "relative",
        }}
      >
        <Typography
          variant="h1"
          component="div"
          sx={{
            fontFamily: "'Segment7', 'MedievalSharp', cursive",
            fontSize: { xs: "3.5rem", sm: "5rem", md: "6.5rem" }, // Adjusted for container
            color:
              theme.palette.mode === "dark"
                ? theme.palette.accent.main // Gold for Dark Mode
                : theme.palette.primary.dark, // Dark Green for Light Mode
            lineHeight: 1,
            textShadow:
              theme.palette.mode === "dark"
                ? `0 0 10px ${theme.palette.accent.light}` // Gold glow
                : `0 0 8px ${theme.palette.primary.light}`, // Subtle Green glow
          }}
        >
          {formatTime(secondsLeft)}
        </Typography>
      </Box>

      {/* Timer Control Buttons */}
      <ButtonGroup
        variant="contained"
        aria-label="timer control button group"
        sx={{ gap: { xs: 1, sm: 2 } }}
        disabled={timerDisabledProp && !isRunning} // Only disable if globally disabled AND timer is not running (allows pausing)
      >
        <Button
          variant="contained"
          onClick={toggleTimer}
          startIcon={isRunning ? <PauseIcon /> : <PlayArrowIcon />}
          disabled={timerDisabledProp && !isRunning} // Specifically disable start if globally disabled
          sx={{
            px: { xs: 2, sm: 4 },
            py: { xs: 1, sm: 1.5 },
            fontSize: { xs: "0.8rem", sm: "1rem" },
            bgcolor: isRunning
              ? theme.palette.warning.main // Use warning color (orange) for Pause
              : theme.palette.success.main,
            color: theme.palette.getContrastText(
              isRunning
                ? theme.palette.warning.main
                : theme.palette.success.main
            ),
            "&:hover": {
              bgcolor: isRunning
                ? theme.palette.warning.dark
                : theme.palette.success.dark,
            },
          }}
        >
          {isRunning ? "Pause" : "Start"}
        </Button>
        <Button
          variant="outlined"
          onClick={resetTimer}
          startIcon={<ReplayIcon />}
          // Reset button should be available even if timerDisabledProp is true, as long as timer is running or was running
          disabled={!isRunning && timerDisabledProp}
          sx={{
            px: { xs: 2, sm: 4 },
            py: { xs: 1, sm: 1.5 },
            fontSize: { xs: "0.8rem", sm: "1rem" },
            color: "secondary.main",
            borderColor:
              theme.palette.mode === "dark"
                ? "secondary.light"
                : "secondary.main", // Ensure visibility in light mode
            "&:hover": {
              borderColor: "secondary.dark",
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          Reset
        </Button>
      </ButtonGroup>
    </Box>
  );
}

// --- Timer Complete Handler ---
const handleTimerComplete = async (durationInSeconds) => {
  if (!user) {
    setPageError("You must be logged in to save a session.");
    return;
  }
  if (!currentSelectedTaskId) {
    setPageError("Please select a task to log this session.");
    return;
  }

  const durationInMinutes = durationInSeconds / 60;
  const timestamp = new Date().toISOString();
  const token = await user.getIdToken();
  const headers = { authtoken: token };

  const sessionData = {
    timestamp,
    duration: durationInMinutes,
    projectId: currentSelectedProjectId || null,
    taskId: currentSelectedTaskId,
  };

  console.log("Attempting to save session:", sessionData);
  setPageError(null); // Clear previous errors

  try {
    const response = await axios.post("/api/sessions", sessionData, {
      headers,
    });
    console.log("Session saved:", response.data);
  } catch (err) {
    console.error("Failed to save session:", err);
    setPageError(
      err.response?.data?.message ||
        "Failed to save your session. Please try again."
    );
  }
};
