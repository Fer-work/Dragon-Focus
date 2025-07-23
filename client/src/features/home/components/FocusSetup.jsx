// src/features/home/components/FocusSetup.jsx

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import FocusSetupUI from "./FocusSetupUI";
import ProjectFormModal from "../../projects/components/ProjectFormModal";
import TaskFormModal from "../../tasks/components/TaskFormModal";

const FocusSetup = ({ user, onFocusTargetsChange }) => {
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
      if (!user) return;
      setIsLoadingTasks(true);
      setError(null);

      // Dynamically set the endpoint based on whether a projectId is provided
      const endpoint = projectId
        ? `/api/projects/${projectId}/tasks`
        : "/api/tasks";

      try {
        const token = await user.getIdToken();
        const response = await axios.get(endpoint, {
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

  // --- 2. Adjust the useEffect that triggers fetching tasks ---
  useEffect(() => {
    // This now correctly calls fetchTasks whether a project is selected or not.
    // On initial mount, it will call fetchTasks(""), fetching all tasks.
    // When a project is selected, it will call fetchTasks("someId"), fetching filtered tasks.
    fetchTasks(selectedProjectId);

    // If the project selection is cleared, also clear the task selection.
    if (!selectedProjectId) {
      setSelectedTaskId("");
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
      <FocusSetupUI
        projects={projects}
        tasks={tasks}
        selectedProjectId={selectedProjectId}
        selectedTaskId={selectedTaskId}
        selectedProjectName={selectedProjectObject?.name || "Unassigned"}
        isLoadingProjects={isLoadingProjects}
        isLoadingTasks={isLoadingTasks}
        error={error}
        onProjectChange={setSelectedProjectId}
        onTaskChange={setSelectedTaskId}
        onOpenCreateProjectModal={handleOpenCreateProjectModal}
        // Typo Fix: Corrected prop name
        onOpenEditProjectModal={() =>
          handleOpenEditProjectModal(selectedProjectObject)
        }
        onOpenCreateTaskModal={handleOpenCreateTaskModal}
        onOpenEditTaskModal={(task) => handleOpenEditTaskModal(task)}
        onClearError={() => setError(null)}
      />

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
        projectId={selectedProjectId || null}
      />
    </>
  );
};

export default FocusSetup;
