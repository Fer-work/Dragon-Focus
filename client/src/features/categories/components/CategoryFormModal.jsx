import { useState, useEffect } from "react";
import apiClient from "../../../api/apiClient";
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
  useTheme, // Import useTheme
} from "@mui/material";
import useUser from "../../../globalHooks/useUser"; // To get the auth token
import { useNotification } from "../../../globalHooks/NotificationContext";

// REVISED: Using a function to create a theme-aware style object.
const createModalStyle = (theme) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: "70%", md: "500px" },
  bgcolor: "background.paper",
  // REVISED: Using the theme's divider and shadow for consistency.
  border: `2px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[24],
  p: 4,
  borderRadius: 2,
  maxHeight: "90vh",
  overflowY: "auto",
});

const CategoryFormModal = ({ open, onClose, onSave, initialCategoryData }) => {
  const { showNotification } = useNotification();
  const { user } = useUser(); // For getting the auth token
  const theme = useTheme();
  const isEditMode = Boolean(initialCategoryData);

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

  // Pre-fill form if in edit mode
  useEffect(() => {
    if (isEditMode && initialCategoryData) {
      setFormState({
        name: initialCategoryData.name || "",
        description: initialCategoryData.description || "",
        color: initialCategoryData.color || "#4A90E2",
        status: initialCategoryData.status || "active",
      });
    } else {
      // Reset form for create mode or if initialCategoryData is not there
      setFormState({
        name: "",
        description: "",
        color: "#4A90E2",
        status: "active",
      });
    }
  }, [initialCategoryData, isEditMode, open]); // Re-run if initialCategoryData, mode, or open status changes

  // --- Key Change: A single handler for all form inputs ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    if (!user) {
      showNotification("You must be logged in to save a category.", "error");
      setIsLoading(false);
      return;
    }

    const categoryData = formState;

    try {
      let response;
      if (isEditMode) {
        response = await apiClient.put(
          `/categories/${initialCategoryData._id}`,
          categoryData
        );
      } else {
        response = await apiClient.post("/categories", categoryData);
      }
      onSave(response.data.category || response.data);
      handleClose();
    } catch (err) {
      console.error("Failed to save category:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to save category. Please try again.";
      // If validation errors are an array, format them
      if (
        err.response?.data?.errors &&
        Array.isArray(err.response.data.errors)
      ) {
        showNotification(`${err.response.data.errors.join(", ")}`, "error");
      } else {
        showNotification(errorMessage, "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Don't reset form fields here if user might want to reopen and continue
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="category-form-modal-title"
      aria-describedby="category-form-modal-description"
    >
      <Box
        sx={createModalStyle(theme)}
        component="form"
        onSubmit={handleSubmit}
      >
        <Typography
          id="category-form-modal-title"
          variant="h6"
          component="h2"
          gutterBottom
          // Added for consistency with the other modal
          sx={{ color: "primary.main", fontWeight: "bold" }}
        >
          {isEditMode ? "Edit Category" : "Create New Category"}
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Category Name"
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
            <FormControl fullWidth variant="outlined" disabled={isLoading}>
              <InputLabel id="category-status-label">Status</InputLabel>
              <Select
                name="status"
                labelId="category-status-label"
                id="category-status"
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
              "Create Category"
            )}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CategoryFormModal;
