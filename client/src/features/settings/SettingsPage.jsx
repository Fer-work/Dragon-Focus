import React, { useState, useContext, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Alert, // For feedback messages
  useTheme,
} from "@mui/material";
import { SettingsContext } from "./hooks/SettingsContext";

const SettingsPage = () => {
  const {
    pomodoroDuration,
    shortBreakDuration,
    longBreakDuration,
    longBreakInterval,
    updateSettings,
  } = useContext(SettingsContext);
  const theme = useTheme();

  // Local state for form inputs, initialized from context
  const [localPomodoroDuration, setLocalPomodoroDuration] =
    useState(pomodoroDuration);
  const [localShortBreakDuration, setLocalShortBreakDuration] =
    useState(shortBreakDuration);
  const [localLongBreakDuration, setLocalLongBreakDuration] =
    useState(longBreakDuration);
  const [localLongBreakInterval, setLocalLongBreakInterval] =
    useState(longBreakInterval);

  const [feedbackMessage, setFeedbackMessage] = useState({
    type: "",
    text: "",
  }); // For success/error messages

  // Effect to update local state if context values change (e.g., loaded from localStorage later)
  useEffect(() => {
    setLocalPomodoroDuration(pomodoroDuration);
    setLocalShortBreakDuration(shortBreakDuration);
    setLocalLongBreakDuration(longBreakDuration);
    setLocalLongBreakInterval(longBreakInterval);
  }, [
    pomodoroDuration,
    shortBreakDuration,
    longBreakDuration,
    longBreakInterval,
  ]);

  const handleSaveSettings = (event) => {
    event.preventDefault();
    setFeedbackMessage({ type: "", text: "" }); // Clear previous message

    // Basic validation (ensure values are positive numbers)
    const pd = parseInt(localPomodoroDuration, 10);
    const sbd = parseInt(localShortBreakDuration, 10);
    const lbd = parseInt(localLongBreakDuration, 10);
    const lbi = parseInt(localLongBreakInterval, 10);

    if (
      isNaN(pd) ||
      pd <= 0 ||
      isNaN(sbd) ||
      sbd <= 0 ||
      isNaN(lbd) ||
      lbd <= 0 ||
      isNaN(lbi) ||
      lbi <= 0
    ) {
      setFeedbackMessage({
        type: "error",
        text: "All durations and intervals must be positive numbers.",
      });
      return;
    }

    updateSettings({
      pomodoroDuration: pd,
      shortBreakDuration: sbd,
      longBreakDuration: lbd,
      longBreakInterval: lbi,
    });
    setFeedbackMessage({
      type: "success",
      text: "Settings saved successfully!",
    });

    // Optionally, clear message after a few seconds
    setTimeout(() => setFeedbackMessage({ type: "", text: "" }), 3000);
  };

  const commonTextFieldProps = {
    type: "number",
    variant: "outlined", // Consistent variant
    fullWidth: true,
    margin: "normal",
    InputLabelProps: {
      sx: { color: "text.secondary" }, // Style for label
    },
    inputProps: {
      min: 1, // Minimum value for durations/interval
      sx: { color: "text.primary" }, // Style for input text
    },
    sx: {
      "& label.Mui-focused": { color: "primary.light" },
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          borderColor:
            theme.palette.neutral[theme.palette.mode === "dark" ? 500 : 300],
        },
        "&:hover fieldset": { borderColor: "primary.light" },
        "&.Mui-focused fieldset": { borderColor: "primary.main" },
      },
    },
  };

  return (
    <Container
      component="main"
      maxWidth="sm" // Controls the max width of the settings form
      sx={{
        mt: { xs: 2, sm: 4 }, // Margin top
        mb: 4, // Margin bottom
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: { xs: 2, sm: 3, md: 4 }, // Responsive padding
          width: "100%",
          bgcolor: "background.paper",
          borderRadius: 3,
          border: `1px solid ${
            theme.palette.neutral[theme.palette.mode === "dark" ? 600 : 300]
          }`,
          boxShadow: "0px 8px 25px rgba(0,0,0,0.15)",
        }}
      >
        <Typography
          component="h1"
          variant="h3" // Thematic font will apply
          color="primary.main"
          align="center"
          sx={{ fontWeight: "bold", mb: 3 }}
        >
          ⚙️ Timer Settings ⚙️
        </Typography>

        {feedbackMessage.text && (
          <Alert
            severity={feedbackMessage.type || "info"}
            sx={{ width: "100%", mb: 2 }}
          >
            {feedbackMessage.text}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSaveSettings}
          sx={{ width: "100%" }}
        >
          <Grid container spacing={2}>
            {" "}
            {/* Use Grid for better spacing of multiple fields */}
            <Grid item xs={12} sm={6}>
              <TextField
                id="pomodoro-duration"
                label="Pomodoro (minutes)"
                value={localPomodoroDuration}
                onChange={(e) => setLocalPomodoroDuration(e.target.value)}
                {...commonTextFieldProps}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="short-break-duration"
                label="Short Break (minutes)"
                value={localShortBreakDuration}
                onChange={(e) => setLocalShortBreakDuration(e.target.value)}
                {...commonTextFieldProps}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="long-break-duration"
                label="Long Break (minutes)"
                value={localLongBreakDuration}
                onChange={(e) => setLocalLongBreakDuration(e.target.value)}
                {...commonTextFieldProps}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="long-break-interval"
                label="Long Break Interval (sessions)"
                value={localLongBreakInterval}
                onChange={(e) => setLocalLongBreakInterval(e.target.value)}
                {...commonTextFieldProps}
                helperText="After how many Pomodoros"
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{
              mt: 3,
              mb: 2,
              py: 1.5,
              fontSize: "1rem",
              fontWeight: "bold",
              color: theme.palette.getContrastText(theme.palette.primary.main),
              "&:hover": { bgcolor: "primary.dark" },
            }}
          >
            Save Settings
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default SettingsPage;
