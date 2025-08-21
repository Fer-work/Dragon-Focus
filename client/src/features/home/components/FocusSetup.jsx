// src/features/home/components/FocusSetup.jsx

import { useState, useEffect, useCallback } from "react";
import apiClient from "../../../api/apiClient";
import FocusSetupUI from "./FocusSetupUI";
import CategoryFormModal from "../../categories/components/CategoryFormModal";
import TaskFormModal from "../../tasks/components/TaskFormModal";
import { useNotification } from "../../../globalHooks/NotificationContext";

const FocusSetup = ({ user, onFocusTargetsChange }) => {
  // 2. --- Get the showNotification function from the context ---
  const { showNotification } = useNotification();

  // API Data State
  const [categories, setCategories] = useState([]);
  const [allTasks, setAllTasks] = useState([]); // Holds all tasks fetched initially
  const [filteredTasks, setFilteredTasks] = useState([]); // Holds tasks for the dropdown
  // Selection State
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState("");
  // Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  // A single loading state for the initial data fetch
  const [isLoading, setIsLoading] = useState(true);
  const [isSlowLoad, setIsSlowLoad] = useState(false);

  // --- "Waking Up" Message Logic ---
  useEffect(() => {
    const slowLoadTimer = setTimeout(() => {
      if (isLoading) {
        showNotification(
          "One moment, waking up the Dragon Server...",
          "info",
          10000
        );
        setIsSlowLoad(true);
      }
    }, 3000); // 3-second delay
    return () => clearTimeout(slowLoadTimer);
  }, [isLoading, showNotification]);

  // --- Unified Data Fetching with Promise.all ---
  const fetchData = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setIsSlowLoad(false);

    try {
      // Run requests for categories and all tasks in parallel
      const [categoriesResponse, tasksResponse] = await Promise.all([
        apiClient.get("/categories"),
        apiClient.get("/tasks"), // Fetches all tasks for the user
      ]);

      setCategories(categoriesResponse.data || []);
      setAllTasks(tasksResponse.data || []);
      setFilteredTasks(tasksResponse.data || []); // Initially, the dropdown shows all tasks
    } catch (err) {
      console.error("Failed to fetch initial data:", err);
      showNotification("Failed to load your categories and tasks.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [user, showNotification]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Local Task Filtering (No Network Request) ---
  useEffect(() => {
    if (selectedCategoryId) {
      // If a category is selected, filter the already-loaded tasks
      const newFilteredTasks = allTasks.filter(
        (task) => task.categoryId === selectedCategoryId
      );
      setFilteredTasks(newFilteredTasks);
    } else {
      // If no category is selected, show all tasks
      setFilteredTasks(allTasks);
    }
    // Always reset the selected task when the category changes
    setSelectedTaskId("");
  }, [selectedCategoryId, allTasks]);

  // Inform HomePage when selections change
  useEffect(() => {
    if (onFocusTargetsChange) {
      onFocusTargetsChange(selectedCategoryId, selectedTaskId);
    }
  }, [selectedCategoryId, selectedTaskId, onFocusTargetsChange]);

  // --- Categories Modal Handlers ---
  const handleCategorySave = (savedCategory) => {
    // This logic is now much cleaner because we just need to re-fetch everything
    // to ensure data consistency after a save.
    fetchData();
    setSelectedCategoryId(savedCategory._id);
    handleCategoryModalClose();
    showNotification(`Category "${savedCategory.name}" saved!`, "success");
  };

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

  // --- Task Modal Handlers ---
  const handleTaskSave = (savedTask) => {
    fetchData(); // Re-fetch to get the latest list
    setSelectedTaskId(savedTask._id);
    handleTaskModalClose();
    showNotification(`Task "${savedTask.name}" saved!`, "success");
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

  // --- Render Logic ---
  const selectedCategoryObject = categories.find(
    (p) => p._id === selectedCategoryId
  );

  return (
    <>
      <FocusSetupUI
        categories={categories}
        tasks={filteredTasks}
        selectedCategoryId={selectedCategoryId}
        selectedTaskId={selectedTaskId}
        selectedCategoryName={selectedCategoryObject?.name || "Unassigned"}
        isLoading={isLoading}
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
