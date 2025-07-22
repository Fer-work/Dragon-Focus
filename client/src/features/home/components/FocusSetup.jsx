// src/features/home/components/FocusSetup.jsx

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
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

import ProjectFormModal from "../modals/ProjectFormModal";
import TaskFormModal from "../modals/TaskFormModal";
// Note: useUser will be passed as a prop or used directly if FocusSetup has access to the same context/hook setup
// For this refactor, let's assume `user` is passed as a prop.

const FocusSetup = ({ user, onFocusTargetsChange, onPageError }) => {
  const [currentSelectedProjectId, setCurrentSelectedProjectId] = useState("");
  const [currentSelectedTaskId, setCurrentSelectedTaskId] = useState("");
  const theme = useTheme();

  // API Data State
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  // Selection State
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState("");

  // Modal State
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  // Loading and Error State
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [error, setError] = useState(null); // Component-specific error

  // Inform HomePage when selections change
  useEffect(() => {
    if (onFocusTargetsChange) {
      onFocusTargetsChange(selectedProjectId, selectedTaskId);
    }
  }, [selectedProjectId, selectedTaskId, onFocusTargetsChange]);

  // Pass errors up to HomePage if needed, or handle them locally
  useEffect(() => {
    if (onPageError && error) {
      onPageError(error);
    }
  }, [error, onPageError]);

  // --- Data Fetching ---
  const fetchProjects = useCallback(async () => {
    if (!user) return;
    setIsLoadingProjects(true);
    setError(null);
    try {
      const token = await user.getIdToken();
      const response = await axios.get("/api/projects", {
        headers: { authtoken: token },
      });
      setProjects(response.data || []);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
      setError(err.response?.data?.message || "Failed to load projects.");
      setProjects([]);
    } finally {
      setIsLoadingProjects(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const fetchTasks = useCallback(
    async (projectId) => {
      if (!user || !projectId) {
        setTasks([]);
        return;
      }
      setIsLoadingTasks(true);
      setError(null);
      try {
        const token = await user.getIdToken();
        const response = await axios.get(`/api/projects/${projectId}/tasks`, {
          headers: { authtoken: token },
        });
        setTasks(response.data || []);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
        setError(
          err.response?.data?.message ||
            "Failed to load tasks for the selected project."
        );
        setTasks([]);
      } finally {
        setIsLoadingTasks(false);
      }
    },
    [user]
  );

  useEffect(() => {
    if (selectedProjectId) {
      fetchTasks(selectedProjectId);
    } else {
      setTasks([]);
      setSelectedTaskId(""); // Clear selected task if project is cleared
    }
  }, [selectedProjectId, fetchTasks]);

  // --- Modal Handlers ---
  const handleOpenCreateProjectModal = () => {
    setProjectToEdit(null);
    setIsProjectModalOpen(true);
  };

  const handleOpenEditProjectModal = (project) => {
    setProjectToEdit(project);
    setIsProjectModalOpen(true);
  };

  const handleProjectModalClose = () => {
    setIsProjectModalOpen(false);
    setProjectToEdit(null);
  };

  const handleProjectSave = (savedProject) => {
    if (projectToEdit) {
      setProjects((prevProjects) =>
        prevProjects.map((p) => (p._id === savedProject._id ? savedProject : p))
      );
    } else {
      setProjects((prevProjects) => [...prevProjects, savedProject]);
    }
    if (selectedProjectId === savedProject._id || !projectToEdit) {
      setSelectedProjectId(savedProject._id); // Auto-select new/edited project
    }
    handleProjectModalClose();
  };

  const handleOpenCreateTaskModal = () => {
    setTaskToEdit(null);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditTaskModal = (task) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  const handleTaskModalClose = () => {
    setIsTaskModalOpen(false);
    setTaskToEdit(null);
  };

  const handleTaskSave = (savedTask) => {
    if (taskToEdit) {
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t._id === savedTask._id ? savedTask : t))
      );
    } else {
      setTasks((prevTasks) => [...prevTasks, savedTask]);
    }
    setSelectedTaskId(savedTask._id); // Auto-select new/edited task
    handleTaskModalClose();
  };

  // --- Render Logic ---
  const selectedProjectObject = projects.find(
    (p) => p._id === selectedProjectId
  );

  return (
    <>
      {" "}
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
            onClose={() => setError(null)} // Allow dismissing the error
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
                onChange={(e) => setSelectedProjectId(e.target.value)}
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
                  <em>Select a Project</em>
                </MenuItem>
                {projects.map((project) => (
                  <MenuItem key={project._id} value={project._id}>
                    {project.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {selectedProjectId && selectedProjectObject && (
              <IconButton
                onClick={() =>
                  handleOpenEditProjectModal(selectedProjectObject)
                }
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
            onClick={handleOpenCreateProjectModal}
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
            <FormControl
              fullWidth
              variant="outlined"
              disabled={isLoadingTasks || !selectedProjectId}
            >
              <InputLabel
                id="task-select-label"
                sx={{ color: "text.secondary" }}
              >
                Task (Optional)
              </InputLabel>
              <Select
                labelId="task-select-label"
                value={selectedTaskId}
                onChange={(e) => setSelectedTaskId(e.target.value)}
                label="Task (Optional)"
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
            {selectedTaskId && tasks.find((t) => t._id === selectedTaskId) && (
              <IconButton
                onClick={() =>
                  handleOpenEditTaskModal(
                    tasks.find((t) => t._id === selectedTaskId)
                  )
                }
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
            onClick={handleOpenCreateTaskModal}
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
            New Task for "{selectedProjectObject?.name || "Project"}"
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
      {/* Modals */}
      <ProjectFormModal
        open={isProjectModalOpen}
        onClose={handleProjectModalClose}
        onSave={handleProjectSave}
        initialProjectData={projectToEdit}
      />
      <TaskFormModal
        open={isTaskModalOpen}
        onClose={handleTaskModalClose}
        onSave={handleTaskSave}
        initialTaskData={taskToEdit}
        projectId={selectedProjectId} // Pass the currently selected project ID
      />
    </>
  );
};

export default FocusSetup;
