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
  Alert, // For displaying errors
} from "@mui/material";
import useUser from "../../../globalHooks/useUser"; // To get the auth token

// Define the style for the modal content
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

const ProjectFormModal = ({ open, onClose, onSave, initialProjectData }) => {
  const { user } = useUser(); // For getting the auth token
  const isEditMode = Boolean(initialProjectData);

  // Form state
  // --- Key Change: Group form state into one object ---
  const [formState, setFormState] = useState({
    name: "",
    description: "",
    color: "#4A90E2",
    status: "active",
  });

  // API call state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pre-fill form if in edit mode
  useEffect(() => {
    if (isEditMode && initialProjectData) {
      setFormState({
        name: initialProjectData.name || "",
        description: initialProjectData.description || "",
        color: initialProjectData.color || "#4A90E2",
        status: initialProjectData.status || "active",
      });
    } else {
      // Reset form for create mode or if initialProjectData is not there
      setFormState({
        name: "",
        description: "",
        color: "#4A90E2",
        status: "active",
      });
    }
  }, [initialProjectData, isEditMode, open]); // Re-run if initialProjectData, mode, or open status changes

  // --- Key Change: A single handler for all form inputs ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null); // Clear previous errors
    setIsLoading(true);

    if (!user) {
      setError("You must be logged in to save a project.");
      setIsLoading(false);
      return;
    }

    const token = await user.getIdToken();
    const headers = { authtoken: token };

    const projectData = formState;

    try {
      let response;
      if (isEditMode) {
        response = await axios.put(
          `/api/projects/${initialProjectData._id}`,
          projectData,
          { headers }
        );
      } else {
        response = await axios.post("/api/projects", projectData, { headers });
      }
      onSave(response.data.project || response.data);
      handleClose();
    } catch (err) {
      console.error("Failed to save project:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to save project. Please try again.";
      // If validation errors are an array, format them
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
    setError(null); // Clear errors when closing
    // Don't reset form fields here if user might want to reopen and continue
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="project-form-modal-title"
      aria-describedby="project-form-modal-description"
    >
      <Box sx={modalStyle} component="form" onSubmit={handleSubmit}>
        <Typography
          id="project-form-modal-title"
          variant="h6"
          component="h2"
          gutterBottom
        >
          {isEditMode ? "Edit Project" : "Create New Project"}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Project Name"
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
            <TextField
              label="Color (e.g., #RRGGBB)"
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
            <FormControl fullWidth variant="outlined" disabled={isLoading}>
              <InputLabel id="project-status-label">Status</InputLabel>
              <Select
                labelId="project-status-label"
                id="project-status"
                value={formState.status}
                label="Status"
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, status: e.target.value }))
                }
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="on-hold">On Hold</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="archived">Archived</MenuItem>
              </Select>
            </FormControl>
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
              "Create Project"
            )}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ProjectFormModal;
