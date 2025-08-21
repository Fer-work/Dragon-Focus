import React, { useState, useContext, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { SettingsContext } from "./hooks/SettingsContext";
import { useNotification } from "../../globalHooks/NotificationContext";

const SettingsPage = () => {
  const { showNotification } = useNotification();
  // Key Fix 1: Correctly destructure the context value
  const { settings, updateSettings, isSettingsLoading } =
    useContext(SettingsContext);
  const theme = useTheme();

  // Refactor: Use a single state object for the form
  const [formState, setFormState] = useState(settings);
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
    setIsSaving(true);

    const newSettings = {
      pomodoroDuration: parseInt(formState.pomodoroDuration, 10),
      shortBreakDuration: parseInt(formState.shortBreakDuration, 10),
      longBreakDuration: parseInt(formState.longBreakDuration, 10),
      longBreakInterval: parseInt(formState.longBreakInterval, 10),
    };

    // Check for valid numbers
    if (Object.values(newSettings).some((val) => isNaN(val) || val <= 0)) {
      showNotification("All values must be positive numbers.", "error");
      setIsSaving(false);
      return;
    }

    const result = await updateSettings(newSettings);

    if (result.success) {
      // Use the global notification for success messages
      showNotification("Settings saved successfully!", "success");
    } else {
      // Use the global notification for API errors
      showNotification(result.error || "Failed to save settings.", "error");
    }

    setIsSaving(false);
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
    <Box
      sx={{
        width: "100%",
        height: "100%",
        p: { xs: 1, sm: 2 },
        color: "text.primary",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          flex: 1,
          p: { xs: 2, sm: 3, md: 4 }, // Responsive padding
          width: "100%",
          height: "100%",
          bgcolor: "background.paper",
          borderRadius: 3,
          // REVISED: Using theme tokens for a consistent look.
          border: `2px solid ${theme.palette.primary.main}`,
          boxShadow: `0px 0px 5px 2px ${theme.palette.accent.main}`,
        }}
      >
        <Box
          component="form"
          onSubmit={handleSaveSettings}
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
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
    </Box>
  );
};

export default SettingsPage;
