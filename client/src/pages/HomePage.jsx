import { useState, useContext, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  IconButton,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit"; // MUI icon for edit
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"; // MUI icon for add

import Timer from "../components/Timer";
import ProjectFormModal from "../components/modals/ProjectFormModal"; // Import the modal
import TaskFormModal from "../components/modals/TaskFormModal"; // Import the modal
import useUser from "../utils/useUser";
import { SettingsContext } from "../utils/SettingsContext";
import "../styles/home.css"; // Assuming styling is primarily via MUI sx or a global theme

const HomePage = () => {
  const { pomodoroDuration } = useContext(SettingsContext);
  const { user } = useUser();

  // API Data State
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  // Selection State
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState("");

  // Modal State
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null); // null for create, project object for edit
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null); // null for create, task object for edit

  // Loading and Error State
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [pageError, setPageError] = useState(null); // For general page errors

  // Session Log State (can be kept or moved as needed)
  const [sessionLogs, setSessionLogs] = useState([]);

  // --- Authentication Token ---
  // This useEffect for logging the token can be removed if no longer needed for debugging
  useEffect(() => {
    const logToken = async () => {
      if (user) {
        try {
          const token = await user.getIdToken(true);
          console.log("HomePage Mounted - Firebase ID Token:", token);
        } catch (error) {
          console.error("Error fetching ID token in HomePage:", error);
        }
      }
    };
    logToken();
  }, [user]);

  // --- Data Fetching ---
  const fetchProjects = useCallback(async () => {
    if (!user) return;
    setIsLoadingProjects(true);
    setPageError(null);
    try {
      const token = await user.getIdToken();
      const response = await axios.get("/api/projects", {
        headers: { authtoken: token },
      });
      setProjects(response.data || []);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
      setPageError(err.response?.data?.message || "Failed to load projects.");
      setProjects([]); // Clear projects on error
    } finally {
      setIsLoadingProjects(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]); // user dependency is handled by fetchProjects useCallback

  const fetchTasks = useCallback(
    async (projectId) => {
      if (!user || !projectId) {
        setTasks([]); // Clear tasks if no project is selected or no user
        return;
      }
      setIsLoadingTasks(true);
      setPageError(null);
      try {
        const token = await user.getIdToken();
        // Using the /api/projects/:projectId/tasks endpoint
        const response = await axios.get(`/api/projects/${projectId}/tasks`, {
          headers: { authtoken: token },
        });
        setTasks(response.data || []);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
        setPageError(
          err.response?.data?.message ||
            "Failed to load tasks for the selected project."
        );
        setTasks([]); // Clear tasks on error
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
      setTasks([]); // Clear tasks if no project is selected
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
    setProjectToEdit(null); // Clear editing state
  };

  const handleProjectSave = (savedProject) => {
    // If editing, update the existing project in the list
    if (projectToEdit) {
      setProjects((prevProjects) =>
        prevProjects.map((p) => (p._id === savedProject._id ? savedProject : p))
      );
    } else {
      // If creating, add the new project to the list
      setProjects((prevProjects) => [...prevProjects, savedProject]);
    }
    // If the saved project is the currently selected one, ensure selection remains (or select it if new)
    if (selectedProjectId === savedProject._id || !projectToEdit) {
      setSelectedProjectId(savedProject._id);
    }
    handleProjectModalClose();
  };

  const handleOpenCreateTaskModal = () => {
    if (!selectedProjectId) {
      setPageError("Please select a project before adding a task.");
      return;
    }
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
    // Optionally select the newly created/edited task
    setSelectedTaskId(savedTask._id);
    handleTaskModalClose();
  };

  // --- Timer Complete Handler ---
  const handleTimerComplete = async (durationInSeconds) => {
    if (!user) {
      setPageError("You must be logged in to save a session.");
      return;
    }
    if (!selectedProjectId) {
      setPageError("Please select a project to log this session.");
      // Or, allow logging to a default project if your backend supports it without a projectId
      // For now, we require a project.
      return;
    }

    const durationInMinutes = durationInSeconds / 60;
    const timestamp = new Date().toISOString();
    const token = await user.getIdToken();
    const headers = { authtoken: token };

    const sessionData = {
      timestamp,
      duration: durationInMinutes,
      projectId: selectedProjectId,
      taskId: selectedTaskId || null, // Send null if no task is selected
      // notes: "Default session notes" // You might want a way to add notes
    };

    console.log("Attempting to save session:", sessionData);

    try {
      const response = await axios.post("/api/sessions", sessionData, {
        headers,
      });
      console.log("Session saved:", response.data);
      setSessionLogs((prevLogs) => [
        ...prevLogs,
        response.data.session || response.data,
      ]); // Add the saved session to logs
      // Optionally, provide user feedback (e.g., a success snackbar)
    } catch (err) {
      console.error("Failed to save session:", err);
      setPageError(
        err.response?.data?.message ||
          "Failed to save your session. Please try again."
      );
    }
  };

  // --- Render Logic ---
  const selectedProjectObject = projects.find(
    (p) => p._id === selectedProjectId
  );

  return (
    <Box
      sx={{
        width: "100%", // Simplified width for now
        height: "100%", // Adjust based on header/footer height
        py: 3,
        px: { xs: 1, sm: 2, md: 3 },
        bgcolor: "background.default",
        color: "text.primary",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        sx={{
          width: "100%",
          maxWidth: "1400px",
          height: "100%",
          display: "flex",
          flexDirection: "flex-row",
        }}
      >
        {/* Left Column: Project/Task Selection & Management */}
        <Grid
          item
          xs={12}
          md={5}
          lg={4}
          sx={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            width: "100%",
            height: "100%",
          }}
        >
          {/* // Inner Box for styling the "selection panel" */}
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
              border: (theme) => `2px solid ${theme.palette.neutral[500]}`,
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                textAlign: "center",
                color: "primary.main",
                fontWeight: "bold",
                pb: 1, // Padding bottom for the title
              }}
            >
              Select Focus Setup
            </Typography>

            {pageError && (
              <Alert
                severity="error"
                sx={{ mb: 2, bgcolor: "error.dark", color: "white" }}
              >
                {pageError}
              </Alert>
            )}

            {/* Project Selection */}
            <Box my={2}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 1,
                }}
              >
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
                      "& .MuiSelect-icon": {
                        color: "primary.light",
                      },
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
                {selectedProjectId && (
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
                  sx={{
                    display: "block",
                    margin: "auto",
                    color: "primary.light",
                  }}
                />
              )}
            </Box>

            <Divider sx={{ my: 1, borderColor: "neutral.500" }}></Divider>

            {/* Task Selection (always available but optional) */}
            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 1,
                }}
              >
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
                      "& .MuiSelect-icon": {
                        color: "secondary.light",
                      },
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
                {selectedTaskId &&
                  tasks.find((t) => t._id === selectedTaskId) && (
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
                disabled={!selectedProjectId || isLoadingTasks}
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
                New Task for "{selectedProjectObject?.name || "Project"}"
              </Button>
              {isLoadingTasks && (
                <CircularProgress
                  size={24}
                  sx={{
                    display: "block",
                    margin: "auto",
                    mt: 1,
                    color: "secondary.light",
                  }}
                />
              )}
            </Box>
          </Box>
        </Grid>

        {/* Right Column: Timer */}
        <Grid
          item
          xs={12}
          md={7}
          lg={8}
          sx={{
            flex: 2,
            display: "flex",
            flexDirection: "column",
            height: "100%", // Try to make it take full available height
          }}
        >
          {/* Inner Box for styling the "timer panel" */}
          <Box
            sx={{
              bgcolor: "background.paper",
              borderRadius: 3,
              boxShadow: "0px 5px 15px rgba(0,0,0,0.3)",
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center", // Center timer horizontally
              border: (theme) => `2px solid ${theme.palette.neutral[500]}`,
            }}
          >
            <Timer
              key={selectedProjectId + "-" + selectedTaskId} // Re-key to reset timer if project/task changes
              pomodoroDurationProp={pomodoroDuration} // Pass duration from context
              onTimerComplete={handleTimerComplete}
              disabled={!selectedProjectId} // Disable timer if no project is selected
            />
          </Box>
        </Grid>

        {/* Session Log Display (Optional) - Full Width Below Columns */}
        {sessionLogs.length > 0 && (
          <Grid item xs={12} sx={{ mt: 3 }}>
            <Box
              sx={{
                p: 2,
                bgcolor: "background.paper",
                borderRadius: 2,
                boxShadow: 3,
                border: (theme) => `1px solid ${theme.palette.neutral[400]}`,
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{ color: "accent.main" }}
              >
                Recent Sessions
              </Typography>
              <ul
                style={{
                  listStyleType: "none",
                  paddingLeft: 0,
                  maxHeight: "200px",
                  overflowY: "auto",
                }}
              >
                {sessionLogs.slice(0, 5).map(
                  (
                    log // Show last 5, keep order (newest added to top of array)
                  ) => (
                    <li
                      key={log._id}
                      style={{
                        marginBottom: "10px",
                        padding: "10px",
                        borderBottom: `1px dashed ${theme.palette.neutral[500]}`,
                        borderRadius: "4px",
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        component="strong"
                        sx={{ color: "primary.light" }}
                      >
                        Project: {log.projectId?.name || "Default Project"}
                      </Typography>
                      {log.taskId?.name && (
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary" }}
                        >
                          Task: {log.taskId.name}
                        </Typography>
                      )}
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        Duration: {log.duration} min
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "neutral.300" }}
                      >
                        Completed: {new Date(log.timestamp).toLocaleString()}
                      </Typography>
                    </li>
                  )
                )}
              </ul>
            </Box>
          </Grid>
        )}
      </Grid>

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
        projectId={selectedProjectId} // Pass the currently selected project ID for creating new tasks
      />
    </Box>
  );
};

export default HomePage;
