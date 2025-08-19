// src/features/home/HomePage.jsx
import { useState, useCallback, useContext } from "react";
import apiClient from "../../api/apiClient";
import useUser from "../../globalHooks/useUser";
import HomePageUI from "./HomePageUI";
import { SettingsContext } from "../settings/hooks/SettingsContext";
import { CircularProgress } from "@mui/material";
import { useNotification } from "../../globalHooks/NotificationContext";

const HomePage = () => {
  const { showNotification } = useNotification();
  const { user } = useUser();
  const { settings, isSettingsLoading } = useContext(SettingsContext);

  // --- State Lifted Up to the Parent ---
  // This state is essential for connecting the two child components.
  const [currentSelectedProjectId, setCurrentSelectedProjectId] = useState("");
  const [currentSelectedTaskId, setCurrentSelectedTaskId] = useState("");
  const [pageError, setPageError] = useState(null);

  // --- Callback passed to FocusSetup ---
  const handleFocusTargetsChange = useCallback((categoryId, taskId) => {
    setCurrentSelectedProjectId(categoryId);
    setCurrentSelectedTaskId(taskId);
  }, []);

  // --- Handler for when the Timer completes ---
  const handleTimerComplete = async (durationInSeconds) => {
    if (!user || !currentSelectedTaskId) {
      showNotification("Failed to log in. Please try again later.");

      return;
    }
    setPageError(null);

    try {
      const sessionData = {
        duration: durationInSeconds / 60,
        categoryId: currentSelectedProjectId || null,
        taskId: currentSelectedTaskId,
        timestamp: new Date().toISOString(),
      };

      await apiClient.post("/sessions", sessionData);
      alert("Session stored successfully!");
    } catch (err) {
      console.error("Failed to save session:", err);
      showNotification(
        err.response?.data?.message || "Failed to save your session.",
        "error"
      );
    }
  };

  // TODO: Check this for loading.
  // Don't render until the user and settings are loaded to prevent crashes
  if (isSettingsLoading) {
    // Or return a loading spinner component
    return <CircularProgress size={24} color="inherit" />;
  }

  return (
    <HomePageUI
      user={user}
      onFocusTargetsChange={handleFocusTargetsChange}
      onTimerComplete={handleTimerComplete}
      selectedTaskId={currentSelectedTaskId}
    />
  );
};

export default HomePage;
