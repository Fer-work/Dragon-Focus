// src/features/home/components/FocusSetup.jsx

import { useState, useEffect, useCallback } from "react";
import apiClient from "../../../api/apiClient";
import FocusSetupUI from "./FocusSetupUI";
import CategoryFormModal from "../../categories/components/CategoryFormModal";
import TaskFormModal from "../../tasks/components/TaskFormModal";

// 1. --- Import the new notification hook ---
import { useNotification } from "../../../globalHooks/NotificationContext";

const FocusSetup = ({ user, onFocusTargetsChange }) => {
  // 2. --- Get the showNotification function from the context ---
  const { showNotification } = useNotification();

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
    try {
      const response = await apiClient.get("/categories");
      setCategories(response.data || []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      showNotification(
        err.response?.data?.message || "Failed to load categories."
      );
      setCategories([]);
    } finally {
      setIsLoadingCategories(false);
    }
  }, [user, showNotification]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const fetchTasks = useCallback(
    async (categoryId) => {
      if (!user) return;
      setIsLoadingTasks(true);

      // Dynamically set the endpoint based on whether a categoryId is provided
      const endpoint = categoryId
        ? `/categories/${categoryId}/tasks`
        : "/tasks";

      try {
        const response = await apiClient.get(endpoint);
        setTasks(response.data || []);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
        showNotification(
          err.response?.data?.message ||
            "Failed to load tasks for the selected category."
        );
        setTasks([]);
      } finally {
        setIsLoadingTasks(false);
      }
    },
    [user, showNotification]
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
    showNotification(`Category "${savedCategory.name}" saved!`, "success");
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
    // Show a success message!
    showNotification(`Task "${savedTask.name}" saved!`, "success");
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
        onCategoryChange={setSelectedCategoryId}
        onTaskChange={setSelectedTaskId}
        onOpenCreateCategoryModal={handleOpenCreateCategoryModal}
        // Typo Fix: Corrected prop name
        onOpenEditCategoryModal={() =>
          handleOpenEditCategoryModal(selectedCategoryObject)
        }
        onOpenCreateTaskModal={handleOpenCreateTaskModal}
        onOpenEditTaskModal={(task) => handleOpenEditTaskModal(task)}
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
