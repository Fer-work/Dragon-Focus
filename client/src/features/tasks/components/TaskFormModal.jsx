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
} from "@mui/material";
// For DatePicker, you might need to install and import from @mui/x-date-pickers
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { parseISO, format } from 'date-fns'; // For handling date strings

import useUser from "../../features/authentication/hooks/useUser";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: "70%", md: "500px" },
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: "90vh", // Prevent modal from being too tall
  overflowY: "auto", // Allow scrolling if content overflows
};

const TaskFormModal = ({
  open,
  onClose,
  onSave,
  initialTaskData,
  projectId,
}) => {
  const { user } = useUser();
  const isEditMode = Boolean(initialTaskData);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [dueDate, setDueDate] = useState(null); // For DatePicker
  const [estimatedPomodoros, setEstimatedPomodoros] = useState("");

  // API call state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open) {
      // Only update form when modal is opened
      if (isEditMode && initialTaskData) {
        setName(initialTaskData.name || "");
        setDescription(initialTaskData.description || "");
        setStatus(initialTaskData.status || "pending");
        // setDueDate(initialTaskData.dueDate ? parseISO(initialTaskData.dueDate) : null);
        setDueDate(
          initialTaskData.dueDate ? initialTaskData.dueDate.split("T")[0] : ""
        ); // Simpler for type="date"
        setEstimatedPomodoros(
          initialTaskData.estimatedPomodoros?.toString() || ""
        );
      } else {
        // Reset form for create mode
        setName("");
        setDescription("");
        setStatus("pending");
        setDueDate(""); // Reset to empty string for type="date"
        setEstimatedPomodoros("");
      }
      setError(null); // Clear errors when modal opens/props change
    }
  }, [initialTaskData, isEditMode, open]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!user) {
      setError("You must be logged in to save a task.");
      setIsLoading(false);
      return;
    }

    if (!isEditMode) {
      // projectId is crucial for creating new tasks
      setIsLoading(false);
      return;
    }

    const token = await user.getIdToken();
    const headers = { authtoken: token };

    const taskData = {
      name,
      description,
      status,
      // dueDate: dueDate ? format(dueDate, 'yyyy-MM-dd') : null, // Format for DatePicker
      dueDate: dueDate || null, // For type="date", ensure it's null if empty
      estimatedPomodoros: estimatedPomodoros ? parseInt(estimatedPomodoros) : 0,
      // TODO: Optional now, set default = null.
      projectId: isEditMode ? initialTaskData.projectId : null,
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

      // The task data might be nested under a 'task' key or be the direct response
      const savedTask = response.data.task || response.data;
      onSave(savedTask);
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
    // Don't reset fields here on close, useEffect handles it based on `open` prop
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="task-form-modal-title"
    >
      <Box sx={modalStyle} component="form" onSubmit={handleSubmit}>
        <Typography
          id="task-form-modal-title"
          variant="h6"
          component="h2"
          gutterBottom
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
              variant="outlined"
              fullWidth
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description (Optional)"
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined" disabled={isLoading}>
              <InputLabel id="task-status-label">Status</InputLabel>
              <Select
                labelId="task-status-label"
                value={status}
                label="Status"
                onChange={(e) => setStatus(e.target.value)}
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
              label="Estimated Pomodoros"
              variant="outlined"
              fullWidth
              type="number"
              value={estimatedPomodoros}
              onChange={(e) => setEstimatedPomodoros(e.target.value)}
              disabled={isLoading}
              inputProps={{ min: 0 }}
            />
          </Grid>
          <Grid item xs={12}>
            {/* Using native HTML5 date picker for simplicity. 
                For a richer experience, use MUI's DatePicker from @mui/x-date-pickers */}
            <TextField
              label="Due Date (Optional)"
              type="date"
              fullWidth
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              disabled={isLoading}
            />
            {/* Example for MUI X DatePicker (requires setup)
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Due Date (Optional)"
                value={dueDate}
                onChange={(newValue) => {
                  setDueDate(newValue);
                }}
                renderInput={(params) => <TextField {...params} fullWidth disabled={isLoading} />}
              />
            </LocalizationProvider>
            */}
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
