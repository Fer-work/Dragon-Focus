import { useState, useEffect } from "react";
import axios from "axios";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  useTheme, // Import useTheme to access the theme in our style object
} from "@mui/material";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { parseISO } from "date-fns"; // For handling date strings

import useUser from "../../../globalHooks/useUser"; // To get the auth token

// REVISED: This function now accepts the theme to create dynamic styles.
const createModalStyle = (theme) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: "70%", md: "500px" },
  bgcolor: "background.paper",
  // REVISED: Using the theme's divider color for a consistent, thematic border.
  border: `2px solid ${theme.palette.divider}`,
  // REVISED: Using the theme's shadow ramp for consistency.
  boxShadow: theme.shadows[24],
  p: 4,
  borderRadius: 2,
  maxHeight: "90vh",
  overflowY: "auto",
});

const TaskFormModal = ({
  open,
  onClose,
  onSave,
  initialTaskData,
  categoryId,
}) => {
  const { user } = useUser();
  const theme = useTheme();
  const isEditMode = Boolean(initialTaskData);

  // Form state
  const [formState, setFormState] = useState({
    name: "",
    description: "",
    status: "pending",
    dueDate: null,
    estimatedPomodoros: "",
  });

  // API call state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pre-fill form if in edit mode
  useEffect(() => {
    if (isEditMode && initialTaskData) {
      setFormState({
        name: initialTaskData.name || "",
        description: initialTaskData.description || "",
        status: initialTaskData.status || "pending",
        // Key Change: Parse the date string from the DB into a Date object
        dueDate: initialTaskData.dueDate
          ? parseISO(initialTaskData.dueDate)
          : null,
        estimatedPomodoros:
          initialTaskData.estimatedPomodoros?.toString() || "",
      });
    } else {
      // Reset form for create mode or if initialTaskData is not there
      setFormState({
        name: "",
        description: "",
        status: "pending",
        dueDate: null,
        color: "#4A90E2",
        estimatedPomodoros: "",
      });
    }
  }, [initialTaskData, isEditMode, open]);

  // This handler works for standard TextFields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  // Key Change: A separate handler specifically for the DatePicker
  const handleDateChange = (newDate) => {
    setFormState((prevState) => ({ ...prevState, dueDate: newDate }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!user) {
      setError("You must be logged in to save a task.");
      setIsLoading(false);
      return;
    }

    const token = await user.getIdToken();
    const headers = { authtoken: token };

    // Key Change: Create the final payload, ensuring categoryId is included for new tasks
    const taskData = {
      ...formState,
      // The dueDate is already a Date object, the backend will handle it.
      // If creating a new task, add the categoryId.
      ...(!isEditMode && { categoryId: categoryId }),
    };

    try {
      let response;
      if (isEditMode) {
        response = await axios.put(
          `/api/tasks/${initialTaskData._id}`,
          taskData,
          { headers }
        );
      } else {
        response = await axios.post("/api/tasks", taskData, { headers });
      }
      onSave(response.data.task || response.data);
      handleClose();
    } catch (err) {
      console.error("Failed to save task:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to save task. Please try again.";
      if (
        err.response?.data?.errors &&
        Array.isArray(err.response.data.errors)
      ) {
        setError(err.response.data.errors.join(", "));
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="task-form-modal-title"
    >
      <Box
        sx={createModalStyle(theme)}
        component="form"
        onSubmit={handleSubmit}
      >
        <Typography
          id="task-form-modal-title"
          variant="h6"
          component="h2"
          gutterBottom
          sx={{ color: "primary.main", fontWeight: "bold" }} // A touch of thematic color for the title
        >
          {isEditMode ? "Edit Task" : "Create New Task"}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Task Name"
              name="name"
              variant="outlined"
              fullWidth
              required
              value={formState.name}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description (Optional)"
              name="description"
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              value={formState.description}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined" disabled={isLoading}>
              <InputLabel id="task-status-label">Status</InputLabel>
              <Select
                id="task-status-label"
                name="status"
                label="Status"
                value={formState.status}
                onChange={handleInputChange}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="blocked">Blocked</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Color"
              name="color"
              variant="outlined"
              fullWidth
              type="color" // Using type="color" for a basic color picker
              value={formState.color}
              onChange={handleInputChange}
              disabled={isLoading}
              helperText="Click to pick a color"
              sx={{
                // Attempt to make the color input display the color swatch better
                '& input[type="color"]': {
                  height: "38px", // Match TextField height
                  padding: "0 5px", // Minimal padding
                  cursor: "pointer",
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="estimatedPomodoros"
              label="Estimated Pomodoros"
              type="number"
              value={formState.estimatedPomodoros}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Due Date (Optional)"
                value={formState.dueDate}
                onChange={handleDateChange} // Use the dedicated date handler
                renderInput={(params) => (
                  <TextField {...params} fullWidth disabled={isLoading} />
                )}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>

        <Box
          sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 1 }}
        >
          <Button onClick={handleClose} disabled={isLoading} color="secondary">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={24} />
            ) : isEditMode ? (
              "Save Changes"
            ) : (
              "Create Task"
            )}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default TaskFormModal;
