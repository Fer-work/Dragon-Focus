import React, { useState, useContext, useEffect, useCallback } from "react";
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
  IconButton, // For edit buttons
} from "@mui/material";
import "../styles/home.css";
import EditIcon from "@mui/icons-material/Edit"; // MUI icon for edit
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"; // MUI icon for add

import Timer from "../components/Timer";
import ProjectFormModal from "../components/modals/ProjectFormModal"; // Import the modal
import TaskFormModal from "../components/modals/TaskFormModal"; // Import the modal
import useUser from "../utils/useUser";
import { SettingsContext } from "../utils/SettingsContext";
// import '../styles/home.css'; // Assuming styling is primarily via MUI sx or a global theme

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
        minHeight: "100vh", // Adjust based on header/footer height
        p: { xs: 2, md: 3 },
        bgcolor: "background.paper", // TODO: Change later
        color: "text.primary",
        display: "flex",
        flexDirection: "column", // Main axis vertical
        alignItems: "center", // Center content horizontally
      }}
    >
      <Grid
        container
        spacing={3}
        sx={{ maxWidth: "1200px", width: "100%", justifyContent: "center" }}
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
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            p: 1,
          }}
        >
          <Box
            sx={{
              p: 2,
              bgcolor: "background.default",
              borderRadius: 2,
              boxShadow: 3,
              width: "100%",
            }}
          >
            <Typography
              variant="h5"
              gutterBottom
              sx={{ textAlign: "center", color: "primary.main" }}
            >
              Select Focus
            </Typography>

            {pageError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {pageError}
              </Alert>
            )}

            {/* Project Selection */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <FormControl
                fullWidth
                variant="outlined"
                disabled={isLoadingProjects}
              >
                <InputLabel id="project-select-label">Project</InputLabel>
                <Select
                  labelId="project-select-label"
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  label="Project"
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
                  color="primary"
                  size="small"
                  sx={{ ml: 1 }}
                  aria-label="edit project"
                >
                  <EditIcon />
                </IconButton>
              )}
            </Box>
            <Button
              variant="outlined"
              onClick={handleOpenCreateProjectModal}
              startIcon={<AddCircleOutlineIcon />}
              fullWidth
              sx={{ mb: 2 }}
            >
              New Project
            </Button>
            {isLoadingProjects && (
              <CircularProgress
                size={24}
                sx={{ display: "block", margin: "auto" }}
              />
            )}

            {/* Task Selection (only if a project is selected) */}
            {selectedProjectId && (
              <Box mt={2}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <FormControl
                    fullWidth
                    variant="outlined"
                    disabled={isLoadingTasks || !selectedProjectId}
                  >
                    <InputLabel id="task-select-label">
                      Task (Optional)
                    </InputLabel>
                    <Select
                      labelId="task-select-label"
                      value={selectedTaskId}
                      onChange={(e) => setSelectedTaskId(e.target.value)}
                      label="Task (Optional)"
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
                  {selectedTaskId &&
                    tasks.find((t) => t._id === selectedTaskId) && (
                      <IconButton
                        onClick={() =>
                          handleOpenEditTaskModal(
                            tasks.find((t) => t._id === selectedTaskId)
                          )
                        }
                        color="primary"
                        size="small"
                        sx={{ ml: 1 }}
                        aria-label="edit task"
                      >
                        <EditIcon />
                      </IconButton>
                    )}
                </Box>
                <Button
                  variant="outlined"
                  onClick={handleOpenCreateTaskModal}
                  startIcon={<AddCircleOutlineIcon />}
                  fullWidth
                  disabled={!selectedProjectId || isLoadingTasks}
                >
                  New Task for "{selectedProjectObject?.name || "Project"}"
                </Button>
                {isLoadingTasks && (
                  <CircularProgress
                    size={24}
                    sx={{ display: "block", margin: "auto", mt: 1 }}
                  />
                )}
              </Box>
            )}
          </Box>
        </Grid>

        {/* Right Column: Timer */}
        <Grid
          item
          xs={12}
          md={7}
          lg={8}
          sx={{
            display: "flex",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            p: 1,
          }}
        >
          <Box
            sx={{
              p: 2,
              bgcolor: "background.default",
              borderRadius: 2,
              boxShadow: 3,
              width: "100%",
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

        {/* Session Log Display (Optional) */}
        {sessionLogs.length > 0 && (
          <Grid item xs={12} md={10} lg={8} sx={{ mt: 3 }}>
            <Box
              sx={{
                p: 2,
                bgcolor: "background.paper",
                borderRadius: 2,
                boxShadow: 3,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Recent Sessions
              </Typography>
              <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                {sessionLogs
                  .slice(-5)
                  .reverse()
                  .map(
                    (
                      log // Show last 5, newest first
                    ) => (
                      <li
                        key={log._id}
                        style={{
                          marginBottom: "8px",
                          padding: "8px",
                          border: "1px solid #eee",
                          borderRadius: "4px",
                        }}
                      >
                        <strong>Project:</strong> {log.projectId?.name || "N/A"}{" "}
                        <br />
                        {log.taskId?.name && (
                          <>
                            <strong>Task:</strong> {log.taskId.name} <br />
                          </>
                        )}
                        <strong>Duration:</strong> {log.duration} min <br />
                        <strong>Completed:</strong>{" "}
                        {new Date(log.timestamp).toLocaleString()}
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
