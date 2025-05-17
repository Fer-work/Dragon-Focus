import { useState, useEffect, useRef } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useContext } from "react";
import { SettingsContext } from "../utils/SettingsContext"; // Import the context

const Timer = ({ onTimerComplete }) => {
  const { pomodoroDuration, shortBreakDuration, longBreakDuration } =
    useContext(SettingsContext);
  const [secondsLeft, setSecondsLeft] = useState(pomodoroDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [currentSession, setCurrentSession] = useState("pomodoro");
  const intervalRef = useRef(null);

  // Update timer when the active session or durations change
  useEffect(() => {
    switch (currentSession) {
      case "pomodoro":
        setSecondsLeft(pomodoroDuration * 60);
        break;
      case "shortBreak":
        setSecondsLeft(shortBreakDuration * 60);
        break;
      case "longBreak":
        setSecondsLeft(longBreakDuration * 60);
        break;
      default:
        setSecondsLeft(pomodoroDuration * 60);
        break;
    }
  }, [currentSession, pomodoroDuration, shortBreakDuration, longBreakDuration]);

  // Run the timer logic
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            onTimerComplete?.(secondsLeft); // Send the duration of the completed session
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    // Cleanup when component unmounts or isRunning changes
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [isRunning, onTimerComplete, secondsLeft]);

  const toggleTimer = () => {
    setIsRunning((prev) => !prev);
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    switch (currentSession) {
      case "pomodoro":
        setSecondsLeft(pomodoroDuration * 60);
        break;
      case "shortBreak":
        setSecondsLeft(shortBreakDuration * 60);
        break;
      case "longBreak":
        setSecondsLeft(longBreakDuration * 60);
        break;
      default:
        setSecondsLeft(pomodoroDuration * 60);
        break;
    }
    setIsRunning(false);
  };

  const changeSession = (sessionType) => {
    clearInterval(intervalRef.current);
    setCurrentSession(sessionType);
    setIsRunning(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 3,
        borderRadius: 2,
        bgcolor: "background.paper",
        boxShadow: 2,
      }}
    >
      {/* Session Buttons */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
          marginBottom: 2,
          justifyContent: "center",
        }}
      >
        <Button
          variant="contained"
          color={currentSession === "pomodoro" ? "primary" : "default"}
          onClick={() => changeSession("pomodoro")}
          size="small"
        >
          Pomodoro
        </Button>
        <Button
          variant="contained"
          color={currentSession === "shortBreak" ? "primary" : "default"}
          onClick={() => changeSession("shortBreak")}
          size="small"
        >
          Short Break
        </Button>
        <Button
          variant="contained"
          color={currentSession === "longBreak" ? "primary" : "default"}
          onClick={() => changeSession("longBreak")}
          size="small"
        >
          Long Break
        </Button>
      </Box>

      {/* Timer Display */}
      <Typography variant="h2" sx={{ marginBottom: 2 }}>
        {formatTime(secondsLeft)}
      </Typography>

      {/* Timer Buttons */}
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button
          variant="contained"
          color={isRunning ? "error" : "success"}
          onClick={toggleTimer}
          sx={{ padding: "0.75rem 1.5rem" }}
        >
          {isRunning ? "Pause" : "Start"}
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={resetTimer}
          sx={{ padding: "0.75rem 1.5rem" }}
        >
          Reset
        </Button>
      </Box>
    </Box>
  );
};

export default Timer;
