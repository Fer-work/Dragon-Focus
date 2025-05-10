import { useState, useEffect, useRef } from "react";
import { Box, Button, Typography, TextField } from "@mui/material";

const Timer = ({ sessionDuration = 25, onTimerComplete }) => {
  const [secondsLeft, setSecondsLeft] = useState(sessionDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [currentSession, setCurrentSession] = useState("work");
  const [customDuration, setCustomDuration] = useState(sessionDuration); // For custom duration input
  const intervalRef = useRef(null);

  // Update timer if the parent passes a new sessionDuration
  useEffect(() => {
    setSecondsLeft(sessionDuration * 60);
    setCustomDuration(sessionDuration);
  }, [sessionDuration]);

  // Run the timer logic
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            onTimerComplete?.(sessionDuration * 60); // Send duration back to parent
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
  }, [isRunning, sessionDuration]);

  const toggleTimer = () => {
    setIsRunning((prev) => !prev);
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setSecondsLeft(customDuration * 60);
    setIsRunning(false);
  };

  const changeSession = (sessionType, durationInMinutes) => {
    clearInterval(intervalRef.current);
    setCurrentSession(sessionType);
    setSecondsLeft(durationInMinutes * 60);
    setIsRunning(false);
  };

  const handleCustomDurationChange = (e) => {
    const newDuration = parseInt(e.target.value);
    if (newDuration > 0) {
      setCustomDuration(newDuration);
      setSecondsLeft(newDuration * 60);
    }
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
      className="timer"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxHeight: "80vh", // Max height of 80% of viewport height
        overflowY: "auto", // Allow scrolling if the content overflows
      }}
    >
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        🔥 Dragon Timer 🔥
      </Typography>

      {/* Custom Duration Input */}
      <TextField
        label="Custom Time (min)"
        type="number"
        value={customDuration}
        onChange={handleCustomDurationChange}
        variant="outlined"
        sx={{ marginBottom: 2 }}
      />

      {/* Session Buttons */}
      <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
        <Button
          variant="contained"
          color={currentSession === "work" ? "primary" : "default"}
          onClick={() => changeSession("work", 25)}
        >
          Pomodoro (25 min)
        </Button>
        <Button
          variant="contained"
          color={currentSession === "shortBreak" ? "primary" : "default"}
          onClick={() => changeSession("shortBreak", 5)}
        >
          Short Break (5 min)
        </Button>
        <Button
          variant="contained"
          color={currentSession === "longBreak" ? "primary" : "default"}
          onClick={() => changeSession("longBreak", 15)}
        >
          Long Break (15 min)
        </Button>
        <Button
          variant="contained"
          color={currentSession === "focusCycle" ? "primary" : "default"}
          onClick={() => changeSession("focusCycle", 90)}
        >
          Focus Cycle (90 min)
        </Button>
        <Button
          variant="contained"
          color={currentSession === "focusCycleBreak" ? "primary" : "default"}
          onClick={() => changeSession("focusCycleBreak", 20)}
        >
          Focus Break (20 min)
        </Button>
      </Box>

      {/* Timer Display */}
      <Typography variant="h2" sx={{ marginBottom: 2 }}>
        {formatTime(secondsLeft)}
      </Typography>

      {/* Timer Buttons */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          color={isRunning ? "error" : "success"}
          onClick={toggleTimer}
          sx={{ padding: "1rem 2rem" }}
        >
          {isRunning ? "Pause" : "Start"}
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={resetTimer}
          sx={{ padding: "1rem 2rem" }}
        >
          Reset
        </Button>
      </Box>
    </Box>
  );
};

export default Timer;
