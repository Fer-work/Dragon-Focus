import { useState } from "react";
import Timer from "./Timer";
import axios from "axios"; // ✅ Make sure axios is imported
import user from "../utils/useUser";
import "../styles/tracking.css";

const TrackingPage = () => {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState("");
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(null);
  const [newTask, setNewTask] = useState("");
  const [sessionMinutes, setSessionMinutes] = useState(25);
  const [sessionLogs, setSessionLogs] = useState([]); // ✅ Optional: local log

  // Check if user is logged in
  const { isLoading, user } = useUser();

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

    // ✅ Placeholder: Post to API or Firebase
    try {
      const res = await axios.post("/api/sessions", sessionData, { headers });
      console.log("Session saved:", res.data);
    } catch (error) {
      console.error("Failed to save session:", error);
    }
  };

  return (
    <div className="tracking-page">
      <div className="session-length-input">
        <label>Set Focus Duration (minutes):</label>
        <input
          type="number"
          min="5"
          max="120"
          value={sessionMinutes}
          onChange={(e) => setSessionMinutes(Number(e.target.value))}
        />
      </div>

      <Timer
        sessionDuration={sessionMinutes}
        onTimerComplete={handleTimerComplete}
      />

      <div className="task-controls">
        <div className="add-project">
          <input
            type="text"
            placeholder="New Project Name"
            value={newProject}
            onChange={(e) => setNewProject(e.target.value)}
          />
          <button onClick={handleAddProject}>Add Project</button>
        </div>

        {projects.length > 0 && (
          <div className="select-project">
            <select
              value={selectedProjectIndex ?? ""}
              onChange={(e) =>
                setSelectedProjectIndex(
                  e.target.value !== "" ? Number(e.target.value) : null
                )
              }
            >
              <option value="">Select a Project</option>
              {projects.map((project, index) => (
                <option key={index} value={index}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedProjectIndex !== null && (
          <div className="add-task">
            <input
              type="text"
              placeholder="New Task Name"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <button onClick={handleAddTask}>Add Task</button>
            <ul>
              {projects[selectedProjectIndex].tasks.map((task, taskIndex) => (
                <li key={taskIndex}>{task}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Optional: Display session log */}
      {sessionLogs.length > 0 && (
        <div className="session-log">
          <h4>Session History:</h4>
          <ul>
            {sessionLogs.map((log, index) => (
              <li key={index}>
                {log.project} → {log.task} — {log.duration} min @{" "}
                {new Date(log.timestamp).toLocaleTimeString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TrackingPage;
