// src/features/home/components/FocusSetup.jsx

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import FocusSetupUI from "./FocusSetupUI";
import CategoryFormModal from "../../categories/components/CategoryFormModal";
import TaskFormModal from "../../tasks/components/TaskFormModal";

const FocusSetup = ({ user, onFocusTargetsChange }) => {
  // API Data State
  const [categories, setCategories] = useState([]);
  const [tasks, setTasks] = useState([]);
  // Selection State
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState("");
  // Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  // Loading and Error State
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [error, setError] = useState(null); // Component-specific error

  // Inform HomePage when selections change
  useEffect(() => {
    if (onFocusTargetsChange) {
      onFocusTargetsChange(selectedCategoryId, selectedTaskId);
    }
  }, [selectedCategoryId, selectedTaskId, onFocusTargetsChange]);

  // --- Data Fetching ---
  const fetchCategories = useCallback(async () => {
    if (!user) return;
    setIsLoadingCategories(true);
    setError(null);
    try {
      const token = await user.getIdToken();
      const response = await axios.get("/api/categories", {
        headers: { authtoken: token },
      });
      setCategories(response.data || []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setError(err.response?.data?.message || "Failed to load categories.");
      setCategories([]);
    } finally {
      setIsLoadingCategories(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const fetchTasks = useCallback(
    async (categoryId) => {
      if (!user) return;
      setIsLoadingTasks(true);
      setError(null);

      // Dynamically set the endpoint based on whether a categoryId is provided
      const endpoint = categoryId
        ? `/api/categories/${categoryId}/tasks`
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
            "Failed to load tasks for the selected category."
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
    // This now correctly calls fetchTasks whether a category is selected or not.
    // On initial mount, it will call fetchTasks(""), fetching all tasks.
    // When a category is selected, it will call fetchTasks("someId"), fetching filtered tasks.
    fetchTasks(selectedCategoryId);

    // If the category selection is cleared, also clear the task selection.
    if (!selectedCategoryId) {
      setSelectedTaskId("");
    }
  }, [selectedCategoryId, fetchTasks]);

  // --- Modal Handlers ---
  const handleOpenCreateCategoryModal = () => {
    setCategoryToEdit(null);
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategoryModal = (category) => {
    setCategoryToEdit(category);
    setIsCategoryModalOpen(true);
  };

  const handleCategoryModalClose = () => {
    setIsCategoryModalOpen(false);
    setCategoryToEdit(null);
  };

  const handleCategorySave = (savedCategory) => {
    if (categoryToEdit) {
      setCategories((prevCategories) =>
        prevCategories.map((p) =>
          p._id === savedCategory._id ? savedCategory : p
        )
      );
    } else {
      setCategories((prevCategories) => [...prevCategories, savedCategory]);
    }
    if (selectedCategoryId === savedCategory._id || !categoryToEdit) {
      setSelectedCategoryId(savedCategory._id); // Auto-select new/edited category
    }
    handleCategoryModalClose();
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
  const selectedCategoryObject = categories.find(
    (p) => p._id === selectedCategoryId
  );

  return (
    <>
      <FocusSetupUI
        categories={categories}
        tasks={tasks}
        selectedCategoryId={selectedCategoryId}
        selectedTaskId={selectedTaskId}
        selectedCategoryName={selectedCategoryObject?.name || "Unassigned"}
        isLoadingCategories={isLoadingCategories}
        isLoadingTasks={isLoadingTasks}
        error={error}
        onCategoryChange={setSelectedCategoryId}
        onTaskChange={setSelectedTaskId}
        onOpenCreateCategoryModal={handleOpenCreateCategoryModal}
        // Typo Fix: Corrected prop name
        onOpenEditCategoryModal={() =>
          handleOpenEditCategoryModal(selectedCategoryObject)
        }
        onOpenCreateTaskModal={handleOpenCreateTaskModal}
        onOpenEditTaskModal={(task) => handleOpenEditTaskModal(task)}
        onClearError={() => setError(null)}
      />

      <CategoryFormModal
        open={isCategoryModalOpen}
        onClose={handleCategoryModalClose}
        onSave={handleCategorySave}
        initialCategoryData={categoryToEdit}
      />

      <TaskFormModal
        open={isTaskModalOpen}
        onClose={handleTaskModalClose}
        onSave={handleTaskSave}
        initialTaskData={taskToEdit}
        categoryId={selectedCategoryId || null}
      />
    </>
  );
};

export default FocusSetup;
