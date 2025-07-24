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
  CircularProgress,
} from "@mui/material";
import { SettingsContext } from "./hooks/SettingsContext";

const SettingsPage = () => {
  // Key Fix 1: Correctly destructure the context value
  const { settings, updateSettings, isSettingsLoading } =
    useContext(SettingsContext);
  const theme = useTheme();

  // Refactor: Use a single state object for the form
  const [formState, setFormState] = useState(settings);
  const [feedback, setFeedback] = useState({ type: "", text: "" });
  const [isSaving, setIsSaving] = useState(false);

  // This useEffect correctly syncs the form when the global settings are loaded
  useEffect(() => {
    if (settings) {
      setFormState(settings);
    }
  }, [settings]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  // Key Fix 2: Make the save handler async and check the result
  const handleSaveSettings = async (event) => {
    event.preventDefault();
    setFeedback({ type: "", text: "" });
    setIsSaving(true);

    const newSettings = {
      pomodoroDuration: parseInt(formState.pomodoroDuration, 10),
      shortBreakDuration: parseInt(formState.shortBreakDuration, 10),
      longBreakDuration: parseInt(formState.longBreakDuration, 10),
      longBreakInterval: parseInt(formState.longBreakInterval, 10),
    };

    // Check for valid numbers
    if (Object.values(newSettings).some((val) => isNaN(val) || val <= 0)) {
      setFeedback({
        type: "error",
        text: "All values must be positive numbers.",
      });
      setIsSaving(false);
      return;
    }

    const result = await updateSettings(newSettings);

    if (result.success) {
      setFeedback({ type: "success", text: "Settings saved successfully!" });
    } else {
      setFeedback({
        type: "error",
        text: result.error || "Failed to save settings.",
      });
    }

    setIsSaving(false);
    setTimeout(() => setFeedback({ type: "", text: "" }), 4000);
  };

  // While the initial settings are loading, show a spinner
  if (isSettingsLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

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
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3, md: 4 }, // Responsive padding
          width: "100%",
          bgcolor: "background.paper",
          borderRadius: 3,
          // REVISED: Using theme tokens for a consistent look.
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: theme.shadows[6],
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

        {feedback.text && (
          <Alert
            severity={feedback.type || "info"}
            sx={{ width: "100%", mb: 2 }}
          >
            {feedback.text}
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
            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <TextField
                name="pomodoroDuration"
                label="Pomodoro (minutes)"
                type="number"
                value={formState.pomodoroDuration}
                onChange={handleInputChange}
                {...commonTextFieldProps}
              />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <TextField
                name="shortBreakDuration"
                label="Short Break (minutes)"
                type="number"
                value={formState.shortBreakDuration}
                onChange={handleInputChange}
                {...commonTextFieldProps}
              />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <TextField
                name="longBreakDuration"
                label="Long Break (minutes)"
                type="number"
                value={formState.longBreakDuration}
                onChange={handleInputChange}
                {...commonTextFieldProps}
              />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <TextField
                name="longBreakInterval"
                label="Long Break Interval"
                type="number"
                value={formState.longBreakInterval}
                onChange={handleInputChange}
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
            }}
            disabled={isSaving}
          >
            {isSaving ? <CircularProgress size={24} /> : "Save Settings"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default SettingsPage;
