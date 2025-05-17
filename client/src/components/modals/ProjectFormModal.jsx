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
import useUser from "../../utils/useUser"; // To get the auth token

// Define the style for the modal content
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: "70%", md: "500px" }, // Responsive width
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const ProjectFormModal = ({ open, onClose, onSave, initialProjectData }) => {
  const { user } = useUser(); // For getting the auth token
  const isEditMode = Boolean(initialProjectData);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#4A90E2"); // Default color
  const [status, setStatus] = useState("active"); // Default status

  // API call state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pre-fill form if in edit mode
  useEffect(() => {
    if (isEditMode && initialProjectData) {
      setName(initialProjectData.name || "");
      setDescription(initialProjectData.description || "");
      setColor(initialProjectData.color || "#4A90E2");
      setStatus(initialProjectData.status || "active");
    } else {
      // Reset form for create mode or if initialProjectData is not there
      setName("");
      setDescription("");
      setColor("#4A90E2");
      setStatus("active");
    }
  }, [initialProjectData, isEditMode, open]); // Re-run if initialProjectData, mode, or open status changes

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

    const projectData = {
      name,
      description,
      color,
      status,
    };

    try {
      let response;
      if (isEditMode) {
        // Update existing project
        response = await axios.put(
          `/api/projects/${initialProjectData._id}`,
          projectData,
          { headers }
        );
      } else {
        // Create new project
        response = await axios.post("/api/projects", projectData, { headers });
      }

      if (response.data && (response.data.project || response.data)) {
        // The project data might be nested under a 'project' key or be the direct response
        const savedProject = response.data.project || response.data;
        onSave(savedProject); // Pass the saved/updated project data back
        handleClose(); // Close modal on success
      } else {
        throw new Error("Invalid response structure from server.");
      }
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
            <TextField
              label="Color (e.g., #RRGGBB)"
              variant="outlined"
              fullWidth
              type="color" // Using type="color" for a basic color picker
              value={color}
              onChange={(e) => setColor(e.target.value)}
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
                value={status}
                label="Status"
                onChange={(e) => setStatus(e.target.value)}
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
