import { useState, useEffect, useRef, useContext } from "react";
import { Box, Button, Typography, useTheme, ButtonGroup } from "@mui/material";
import { SettingsContext } from "../utils/SettingsContext";

// Optional: Icons for buttons
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import ReplayIcon from "@mui/icons-material/Replay";
import TimerIcon from "@mui/icons-material/Timer"; // For Pomodoro
import FreeBreakfastIcon from "@mui/icons-material/FreeBreakfast"; // For Breaks

const Timer = ({ onTimerComplete, disabled: timerDisabledProp }) => {
  // Added disabled prop
  const { pomodoroDuration, shortBreakDuration, longBreakDuration } =
    useContext(SettingsContext);
  const theme = useTheme();

  const [secondsLeft, setSecondsLeft] = useState(pomodoroDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [currentSession, setCurrentSession] = useState("pomodoro");
  const intervalRef = useRef(null);

  // Effect to update timer when active session or durations change from context
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
    // When session type changes, timer should not be running
    // If it was running, clear interval and set isRunning to false
    if (isRunning) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
    }
  }, [currentSession, pomodoroDuration, shortBreakDuration, longBreakDuration]); // Removed isRunning from deps

  // Effect to run the timer logic
  useEffect(() => {
    if (isRunning && !timerDisabledProp) {
      // Only run if not globally disabled
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            // Pass the duration of the session that just completed
            let completedSessionDuration = 0;
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
      clearInterval(intervalRef.current); // Clear interval if not running or disabled
    }
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [
    isRunning,
    onTimerComplete,
    timerDisabledProp,
    currentSession,
    pomodoroDuration,
    shortBreakDuration,
    longBreakDuration,
  ]); // Added dependencies that affect completedSessionDuration

  const toggleTimer = () => {
    if (timerDisabledProp) return; // Don't toggle if globally disabled
    setIsRunning((prev) => !prev);
  };

  const resetTimer = () => {
    if (timerDisabledProp && !isRunning) return; // Allow reset if running even if disabled, or if not disabled
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
    if (timerDisabledProp && sessionType !== currentSession) return; // Prevent changing session if disabled, unless it's to reset current
    setCurrentSession(sessionType);
    // setIsRunning(false); // This is handled by the first useEffect now
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  // Styles for session buttons
  const getSessionButtonStyle = (sessionName) => ({
    flexGrow: 1,
    color:
      currentSession === sessionName
        ? theme.palette.getContrastText(theme.palette.primary.main)
        : theme.palette.text.secondary, // Inactive text color
    borderColor:
      currentSession === sessionName
        ? "primary.dark"
        : theme.palette.neutral[theme.palette.mode === "dark" ? 600 : 300],
    "&:hover": {
      backgroundColor:
        currentSession === sessionName
          ? "primary.dark"
          : theme.palette.action.hover,
      borderColor:
        currentSession === sessionName
          ? "primary.dark"
          : theme.palette.primary.light,
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
        justifyContent: "space-around", // Distribute space more evenly
        p: { xs: 2, sm: 3 }, // Responsive padding
        // bgcolor, borderRadius, boxShadow, border are inherited from HomePage's timer panel Box
      }}
    >
      {/* Session Type Buttons */}
      <ButtonGroup
        variant="outlined"
        aria-label="outlined primary button group"
        fullWidth
        sx={{ mb: 3 }}
        disabled={timerDisabledProp && isRunning} // Disable changing session type while running & globally disabled
      >
        <Button
          color={currentSession === "pomodoro" ? "primary" : "inherit"}
          variant={currentSession === "pomodoro" ? "contained" : "outlined"}
          onClick={() => changeSession("pomodoro")}
          startIcon={<TimerIcon />}
          sx={getSessionButtonStyle("pomodoro")}
        >
          Pomodoro
        </Button>
        <Button
          color={currentSession === "shortBreak" ? "primary" : "inherit"}
          variant={currentSession === "shortBreak" ? "contained" : "outlined"}
          onClick={() => changeSession("shortBreak")}
          startIcon={<FreeBreakfastIcon />}
          sx={getSessionButtonStyle("shortBreak")}
        >
          Short Break
        </Button>
        <Button
          color={currentSession === "longBreak" ? "primary" : "inherit"}
          variant={currentSession === "longBreak" ? "contained" : "outlined"}
          onClick={() => changeSession("longBreak")}
          startIcon={<FreeBreakfastIcon sx={{ transform: "scale(1.2)" }} />} // Slightly larger icon
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
          alignItems: "center", // Vertically center the text
          width: { xs: "260px", sm: "320px", md: "380px" }, // Responsive width
          height: { xs: "160px", sm: "200px", md: "240px" }, // Responsive height
          bgcolor:
            theme.palette.mode === "dark"
              ? theme.palette.primary[900]
              : theme.palette.neutral[100], // Very dark/light for high contrast
          border: `4px solid ${theme.palette.primary.main}`, // Prominent border with primary color
          borderRadius: "50%", // Make it circular
          boxShadow: `0 0 10px ${theme.palette.primary.light}, 0 0 20px ${theme.palette.accent.main} inset`, // Glow effect
          my: 2, // Adjusted margin
          position: "relative", // For potential pseudo-elements or inner glow
        }}
      >
        <Typography
          variant="h1"
          component="div" // More appropriate than h1 if "Dragon Focus" is the main h1
          sx={{
            fontFamily: "'Segment7', 'MedievalSharp', cursive", // Digital-looking font, fallback to theme
            fontSize: { xs: "4rem", sm: "5.5rem", md: "7rem" }, // Responsive font size
            color: theme.palette.accent.main, // Bright accent color for the digits
            lineHeight: 1, // Ensure text is centered vertically
            textShadow: `0 0 10px ${theme.palette.accent.light}`, // Subtle glow for text
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
        disabled={timerDisabledProp} // Disable control buttons if globally disabled
      >
        <Button
          variant="contained"
          onClick={toggleTimer}
          startIcon={isRunning ? <PauseIcon /> : <PlayArrowIcon />}
          sx={{
            px: { xs: 2, sm: 4 },
            py: { xs: 1, sm: 1.5 },
            fontSize: { xs: "0.8rem", sm: "1rem" },
            bgcolor: isRunning
              ? theme.palette.error.main
              : theme.palette.success.main, // Use theme's success/error
            color: theme.palette.getContrastText(
              isRunning ? theme.palette.error.main : theme.palette.success.main
            ),
            "&:hover": {
              bgcolor: isRunning
                ? theme.palette.error.dark
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
          sx={{
            px: { xs: 2, sm: 4 },
            py: { xs: 1, sm: 1.5 },
            fontSize: { xs: "0.8rem", sm: "1rem" },
            color: "secondary.main",
            borderColor: "secondary.light",
            "&:hover": {
              borderColor: "secondary.main",
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          Reset
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export default Timer;
