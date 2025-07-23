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
  projects,
  tasks,
  selectedProjectId,
  selectedTaskId,
  selectedProjectName,
  isLoadingProjects,
  isLoadingTasks,
  error,
  onProjectChange,
  onTaskChange,
  onOpenCreateProjectModal,
  onOpenEditProjectModal,
  onOpenCreateTaskModal,
  onOpenEditTaskModal,
  onClearError,
}) => {
  const theme = useTheme();

  // Find the selected task object to pass to the edit modal handler
  const selectedTaskObject = tasks.find((t) => t._id === selectedTaskId);

  return (
    <>
      {/* Use Fragment or a Box if you need a root wrapper with styles */}
      {/* Inner Box for styling the "selection panel" */}
      <Box
        sx={{
          p: 2,
          bgcolor: "background.paper",
          borderRadius: 3,
          boxShadow: "0px 5px 15px rgba(0,0,0,0.3)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          gap: 2,
          border: `2px solid ${theme.palette.neutral[500]}`, // Access theme via useTheme
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

        {error && ( // Display component-specific error
          <Alert
            severity="error"
            sx={{ mb: 2, bgcolor: "error.dark", color: "white" }}
            onClose={onClearError} // Allow dismissing the error
          >
            {error}
          </Alert>
        )}

        {/* Project Selection */}
        <Box my={2}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <FormControl
              fullWidth
              variant="outlined"
              disabled={isLoadingProjects}
            >
              <InputLabel
                id="project-select-label"
                sx={{ color: "text.secondary" }}
              >
                Project (Optional)
              </InputLabel>
              <Select
                labelId="project-select-label"
                value={selectedProjectId}
                onChange={(e) => onProjectChange(e.target.value)}
                label="Project (Optional)"
                sx={{
                  color: "text.primary",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "neutral.500",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "primary.light",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "primary.main",
                  },
                  "& .MuiSelect-icon": { color: "primary.light" },
                }}
              >
                <MenuItem value="">
                  <em>Select a Project or None</em>
                </MenuItem>
                {projects.map((project) => (
                  <MenuItem key={project._id} value={project._id}>
                    {project.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {selectedProjectId && (
              <IconButton
                onClick={onOpenEditProjectModal}
                size="medium"
                sx={{
                  color: "accent.main",
                  ml: 1,
                  "&:hover": {
                    color: "primary.dark",
                    bgcolor: "accent.main",
                    opacity: 0.8,
                  },
                }}
                aria-label="edit project"
              >
                <EditIcon />
              </IconButton>
            )}
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={onOpenCreateProjectModal}
            startIcon={<AddCircleOutlineIcon />}
            fullWidth
            sx={{
              mb: 2,
              bgcolor: "primary.main",
              color: (theme) =>
                theme.palette.mode === "dark"
                  ? theme.palette.neutral[900]
                  : theme.palette.common.white,
              "&:hover": { bgcolor: "primary.dark" },
            }}
          >
            New Project
          </Button>
          {isLoadingProjects && (
            <CircularProgress
              size={24}
              sx={{ display: "block", margin: "auto", color: "primary.light" }}
            />
          )}
        </Box>

        <Divider sx={{ my: 1, borderColor: "neutral.500" }} />

        {/* Task Selection */}
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <FormControl fullWidth variant="outlined" disabled={isLoadingTasks}>
              <InputLabel
                id="task-select-label"
                sx={{ color: "text.secondary" }}
              >
                Task (Required)
              </InputLabel>
              <Select
                labelId="task-select-label"
                value={selectedTaskId}
                onChange={(e) => onTaskChange(e.target.value)}
                label="Task (Required)"
                sx={{
                  color: "text.primary",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "neutral.500",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "secondary.light",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "secondary.main",
                  },
                  "& .MuiSelect-icon": { color: "secondary.light" },
                }}
              >
                <MenuItem value="">
                  <em>Select a Task or None</em>
                </MenuItem>
                {tasks.map((task) => (
                  <MenuItem
                    key={task._id}
                    value={task._id}
                    sx={{
                      color: (theme) =>
                        theme.palette.mode === "dark"
                          ? theme.palette.neutral[100]
                          : theme.palette.neutral[900],
                    }}
                  >
                    {task.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {selectedTaskId && selectedTaskObject && (
              <IconButton
                onClick={() => onOpenEditTaskModal(selectedTaskObject)}
                color="secondary"
                size="medium"
                sx={{
                  color: "accent.main",
                  ml: 1,
                  "&:hover": {
                    color: "primary.dark",
                    bgcolor: "accent.main",
                    opacity: 0.8,
                  },
                }}
                aria-label="edit task"
              >
                <EditIcon />
              </IconButton>
            )}
          </Box>
          <Button
            variant="outlined"
            color="secondary"
            onClick={onOpenCreateTaskModal}
            startIcon={<AddCircleOutlineIcon />}
            fullWidth
            disabled={isLoadingTasks}
            sx={{
              mb: 2,
              bgcolor: !selectedProjectId ? "secondary.main" : "primary.main", // Check this logic
              color: (theme) =>
                theme.palette.mode === "dark"
                  ? theme.palette.neutral[900]
                  : theme.palette.common.white,
              "&:hover": { bgcolor: "primary.dark" },
            }}
          >
            New Task for "{selectedProjectName}"
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
      </Box>
    </>
  );
};

export default FocusSetupUI;
