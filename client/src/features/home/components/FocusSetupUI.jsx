// src/features/home/components/FocusSetup.jsx

import {
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  Divider,
  useTheme,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const FocusSetupUI = ({
  categories,
  tasks,
  selectedCategoryId,
  selectedTaskId,
  selectedCategoryName,
  isLoadingCategories,
  isLoadingTasks,
  error,
  onCategoryChange,
  onTaskChange,
  onOpenCreateCategoryModal,
  onOpenEditCategoryModal,
  onOpenCreateTaskModal,
  onOpenEditTaskModal,
  onClearError,
}) => {
  const theme = useTheme();

  // Find the selected task object to pass to the edit modal handler
  const selectedTaskObject = tasks.find((t) => t._id === selectedTaskId);

  // REVISED: Reusable style for the unique edit icon hover effect
  const editIconButtonStyles = {
    color: "accent.main",
    ml: 1,
    "&:hover": {
      // This creates a cool "inverted" effect
      color:
        theme.palette.mode === "dark"
          ? theme.palette.common.black
          : theme.palette.common.white,
      backgroundColor: "accent.main",
    },
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        p: { xs: 2, sm: 3 }, // Keep the padding for internal content.
        gap: 2, // Keep the gap for spacing between elements.
        overflowY: "auto", // Allow this panel's content to scroll if it's too tall.

        // --- THE FLAME EFFECT (INNER BORDER) ---
        // This is the second, brighter border that sits inside the outer red border.
        // It creates the orange layer of our fire gradient.
        border: `2px solid ${theme.palette.secondary.main}`, // Using #ff8c00 orange

        // We use a slightly smaller border radius to nest it perfectly inside the parent panel.
        borderRadius: 2,
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          textAlign: "center",
          color: "primary.main",
          fontWeight: "bold",
          pb: 1,
        }}
      >
        Select Focus Setup
      </Typography>

      {error && (
        // REVISED: Removed sx prop. The `severity` prop now correctly styles the alert
        // using the error colors defined in our theme.
        <Alert severity="error" sx={{ mb: 2 }} onClose={onClearError}>
          {error}
        </Alert>
      )}

      {/* Category Selection */}

      <Box sx={{ my: 1 }}>
        <FormControl
          fullWidth
          variant="outlined"
          disabled={isLoadingCategories}
        >
          <InputLabel
            id="category-select-label"
            sx={{ color: "text.secondary" }}
          >
            Category (Optional)
          </InputLabel>
          {/* REVISED: All complex border styling is removed. The theme handles it now! */}
          <Select
            labelId="category-select-label"
            value={selectedCategoryId}
            onChange={(e) => onCategoryChange(e.target.value)}
            label="Category (Optional)"
            sx={{ color: "text.primary" }} // Only need to set the text color
          >
            <MenuItem value="">
              <em>Select a Category or None</em>
            </MenuItem>
            {categories.map((category) => (
              <MenuItem key={category._id} value={category._id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {selectedCategoryId && (
          <IconButton
            onClick={onOpenEditCategoryModal}
            size="medium"
            sx={editIconButtonStyles}
            aria-label="edit category"
          >
            <EditIcon />
          </IconButton>
        )}
      </Box>
      {/* REVISED: Redundant sx properties removed. `color="primary"` handles all styling. */}
      <Button
        variant="contained"
        color="primary"
        onClick={onOpenCreateCategoryModal}
        startIcon={<AddCircleOutlineIcon />}
        fullWidth
        sx={{ mb: 2 }}
      >
        New Category
      </Button>
      {isLoadingCategories && (
        <CircularProgress
          size={24}
          sx={{ display: "block", margin: "auto", color: "primary.light" }}
        />
      )}

      {/* REVISED: Using the theme's divider color */}
      <Divider sx={{ borderColor: "divider" }} />

      {/* Task Selection */}
      <Box sx={{ mt: 1 }}>
        {/* We can use the color="secondary" prop to hint that this is a secondary input */}
        <FormControl
          fullWidth
          variant="outlined"
          disabled={isLoadingTasks}
          color="secondary"
        >
          <InputLabel id="task-select-label" sx={{ color: "text.secondary" }}>
            Task (Required)
          </InputLabel>
          {/* REVISED: All complex border styling is removed. */}
          <Select
            labelId="task-select-label"
            value={selectedTaskId}
            onChange={(e) => onTaskChange(e.target.value)}
            label="Task (Required)"
            sx={{ color: "text.primary" }}
          >
            <MenuItem value="">
              <em>Select a Task or None</em>
            </MenuItem>
            {tasks.map((task) => (
              <MenuItem key={task._id} value={task._id}>
                {task.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {selectedTaskId && selectedTaskObject && (
          <IconButton
            onClick={() => onOpenEditTaskModal(selectedTaskObject)}
            size="medium"
            sx={editIconButtonStyles}
            aria-label="edit task"
          >
            <EditIcon />
          </IconButton>
        )}
      </Box>
      {/* REVISED: Removed complex/confusing sx prop. `color="secondary"` handles this cleanly. */}

      <Button
        variant="contained"
        color="primary"
        onClick={onOpenCreateTaskModal}
        startIcon={<AddCircleOutlineIcon />}
        fullWidth
        disabled={isLoadingTasks}
        sx={{ mb: 2 }}
      >
        {`New task${
          selectedCategoryName === "Unassigned"
            ? ""
            : `for ${selectedCategoryName}`
        }`}
      </Button>

      {isLoadingTasks && (
        <CircularProgress
          size={24}
          sx={{
            display: "block",
            margin: "auto",
            mt: 1,
            color: "secondary.dark",
          }}
        />
      )}
    </Box>
  );
};

export default FocusSetupUI;
