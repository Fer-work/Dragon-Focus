import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Button,
} from "@mui/material";
import { useState, useContext } from "react";
import { SettingsContext } from "../utils/SettingsContext";

const SettingsPage = () => {
  const {
    pomodoroDuration,
    shortBreakDuration,
    longBreakDuration,
    longBreakInterval,
    updateSettings,
  } = useContext(SettingsContext); // Use useContext to access the context values

  const [localPomodoroDuration, setLocalPomodoroDuration] =
    useState(pomodoroDuration);
  const [localShortBreakDuration, setLocalShortBreakDuration] =
    useState(shortBreakDuration);
  const [localLongBreakDuration, setLocalLongBreakDuration] =
    useState(longBreakDuration);
  const [localLongBreakInterval, setLocalLongBreakInterval] =
    useState(longBreakInterval);

  const handleSaveSettings = () => {
    updateSettings({
      pomodoroDuration: parseInt(localPomodoroDuration),
      shortBreakDuration: parseInt(localShortBreakDuration),
      longBreakDuration: parseInt(localLongBreakDuration),
      longBreakInterval: parseInt(localLongBreakInterval),
    });
    alert("Settings Saved!");
    // You might want to navigate back to the home page or provide better feedback
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <FormControl fullWidth margin="normal">
        <InputLabel htmlFor="pomodoro-duration">Pomodoro (minutes)</InputLabel>
        <TextField
          id="pomodoro-duration"
          type="number"
          value={localPomodoroDuration}
          onChange={(e) => setLocalPomodoroDuration(e.target.value)}
        />
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel htmlFor="short-break-duration">
          Short Break (minutes)
        </InputLabel>
        <TextField
          id="short-break-duration"
          type="number"
          value={localShortBreakDuration}
          onChange={(e) => setLocalShortBreakDuration(e.target.value)}
        />
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel htmlFor="long-break-duration">
          Long Break (minutes)
        </InputLabel>
        <TextField
          id="long-break-duration"
          type="number"
          value={localLongBreakDuration}
          onChange={(e) => setLocalLongBreakDuration(e.target.value)}
        />
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel htmlFor="long-break-interval">
          Long Break Interval
        </InputLabel>
        <TextField
          id="long-break-interval"
          type="number"
          value={localLongBreakInterval}
          onChange={(e) => setLocalLongBreakInterval(e.target.value)}
        />
      </FormControl>

      <Button variant="contained" color="primary" onClick={handleSaveSettings}>
        Save Settings
      </Button>
    </Box>
  );
};

export default SettingsPage;
