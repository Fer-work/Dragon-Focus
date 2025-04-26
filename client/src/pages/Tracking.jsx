import { useState } from "react";
import Timer from "./Timer";
import "../styles/tracking.css";

const TrackingPage = () => {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState("");
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(null);
  const [newTask, setNewTask] = useState("");

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

  return (
    <div className="tracking-page">
      <Timer />

      <div className="task-controls">
        {/* Add Project */}
        <div className="add-project">
          <input
            type="text"
            placeholder="New Project Name"
            value={newProject}
            onChange={(e) => setNewProject(e.target.value)}
          />
          <button onClick={handleAddProject}>Add Project</button>
        </div>

        {/* Select Project */}
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

        {/* Add Task to Selected Project */}
        {selectedProjectIndex !== null && (
          <div className="add-task">
            <input
              type="text"
              placeholder="New Task Name"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <button onClick={handleAddTask}>Add Task</button>

            {/* List Tasks */}
            <ul>
              {projects[selectedProjectIndex].tasks.map((task, taskIndex) => (
                <li key={taskIndex}>{task}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackingPage;
