import { useState, useContext } from "react";
import { useEffect } from "react";
import Timer from "./Timer";
import axios from "axios";
import useUser from "../utils/useUser";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  Typography,
  Grid,
} from "@mui/material";
import "../styles/tracking.css";
import { SettingsContext } from "../utils/SettingsContext"; // Make sure the path is correct

const HomePage = () => {
  const { pomodoroDuration } = useContext(SettingsContext); // Get pomodoroDuration from context
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState("");
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(null);
  const [newTask, setNewTask] = useState("");
  // We no longer need local state for sessionMinutes here
  const [sessionLogs, setSessionLogs] = useState([]);

  // Check if user is logged in
  const { user } = useUser();

  useEffect(() => {
    const fetchToken = async () => {
      if (user) {
        try {
          const token = await user.getIdToken(true); // Pass true to force refresh if needed
          console.log("Firebase ID Token for Postman:", token);
          // You can copy this token from the browser console
        } catch (error) {
          console.error("Error fetching ID token for Postman:", error);
        }
      }
    };
    fetchToken();
  }, [user]); // Re-run if the user object changes

  const handleAddProject = () => {
    if (newProject.trim()) {
      setProjects([...projects, { name: newProject, tasks: [] }]);
      setNewProject("");
    }
  };

  const handleAddTask = () => {
    if (newTask.trim() && selectedProjectIndex !== null) {
      const updatedProjects = projects.map((project, index) =>
        index === selectedProjectIndex
          ? { ...project, tasks: [...project.tasks, newTask] }
          : project
      );
      setProjects(updatedProjects);
      setNewTask("");
    }
  };

  const handleTimerComplete = async (durationInSeconds) => {
    const durationInMinutes = durationInSeconds / 60;
    const timestamp = new Date().toISOString();

    const token = user && (await user.getIdToken());
    console.log("Firebase ID Token: ", token);
    const headers = token ? { authtoken: token } : {};

    const selectedProject =
      selectedProjectIndex !== null
        ? projects[selectedProjectIndex]
        : { name: "Other", tasks: [] };

    const lastTask =
      selectedProject.tasks.length > 0
        ? selectedProject.tasks[selectedProject.tasks.length - 1]
        : "Other";

    const sessionData = {
      timestamp,
      duration: durationInMinutes,
      project: selectedProject.name || "Unamed Project",
      task: lastTask,
      userId: user?.uid || null,
    };

    console.log("Session Completed:", sessionData);

    // Save to local state (optional visual feedback or debugging)
    setSessionLogs((prev) => [...prev, sessionData]);

    // Placeholder: Post to API or Firebase
    try {
      const res = await axios.post("/api/sessions", sessionData, { headers });
      console.log("Session saved:", res.data);
    } catch (error) {
      console.error("Failed to save session:", error);
    }
  };

  return (
    <Box
      sx={{
        width: { xs: "100%", md: "30%", lg: "100%" },
        height: "100%",
        p: 3,
        bgcolor: "background.paper",
        color: "text.primary",
        borderRadius: 2,
        boxShadow: 4,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <Grid container spacing={3} alignItems="flex-start">
        <Grid item xs={12} md={6}>
          {/* Left side: Project and Task Input */}
          <Box>
            <Typography variant="h6">Add a New Project</Typography>
            <TextField
              label="New Project Name"
              value={newProject}
              onChange={(e) => setNewProject(e.target.value)}
              fullWidth
              margin="normal"
            />
            <Button variant="contained" onClick={handleAddProject}>
              Add Project
            </Button>
          </Box>

          {projects.length > 0 && (
            <Box mt={4}>
              <Typography variant="h6">Select a Project</Typography>
              <FormControl fullWidth>
                <InputLabel>Project</InputLabel>
                <Select
                  value={selectedProjectIndex ?? ""}
                  onChange={(e) =>
                    setSelectedProjectIndex(
                      e.target.value !== "" ? Number(e.target.value) : null
                    )
                  }
                >
                  <MenuItem value="">Select a Project</MenuItem>
                  {projects.map((project, index) => (
                    <MenuItem key={index} value={index}>
                      {project.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}

          {selectedProjectIndex !== null && (
            <Box mt={4}>
              <Typography variant="h6">Add a New Task</Typography>
              <TextField
                label="New Task Name"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                fullWidth
                margin="normal"
              />
              <Button variant="contained" onClick={handleAddTask}>
                Add Task
              </Button>

              <Box mt={2}>
                <Typography variant="h6">Tasks:</Typography>
                <ul>
                  {projects[selectedProjectIndex].tasks.map(
                    (task, taskIndex) => (
                      <li key={taskIndex}>{task}</li>
                    )
                  )}
                </ul>
              </Box>
            </Box>
          )}
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          {/* Right side: Timer */}
          <Timer onTimerComplete={handleTimerComplete} />
        </Grid>
      </Grid>

      {/* Optional: Display session log (can be below the grid) */}
      {sessionLogs.length > 0 && (
        <Box mt={4}>
          <Typography variant="h6">Session History</Typography>
          <ul>
            {sessionLogs.map((log, index) => (
              <li key={index}>
                {log.project} → {log.task} — {log.duration} min @{" "}
                {new Date(log.timestamp).toLocaleTimeString()}
              </li>
            ))}
          </ul>
        </Box>
      )}
    </Box>
  );
};

export default HomePage;
