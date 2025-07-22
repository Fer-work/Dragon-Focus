// src/features/home/HomePage.jsx
import { useState, useCallback, useContext } from "react";
import axios from "axios";
import useUser from "../../globalHooks/useUser";
import HomePageUI from "./components/HomePageUI";
import { SettingsContext } from "../settings/hooks/SettingsContext";

const HomePage = () => {
  const { user } = useUser();
  const { settings, isSettingsLoading } = useContext(SettingsContext);

  // --- State Lifted Up to the Parent ---
  // This state is essential for connecting the two child components.
  const [currentSelectedProjectId, setCurrentSelectedProjectId] = useState("");
  const [currentSelectedTaskId, setCurrentSelectedTaskId] = useState("");
  const [pageError, setPageError] = useState(null);

  // --- Callback passed to FocusSetup ---
  const handleFocusTargetsChange = useCallback((projectId, taskId) => {
    setCurrentSelectedProjectId(projectId);
    setCurrentSelectedTaskId(taskId);
  }, []);

  // --- Handler for when the Timer completes ---
  const handleTimerComplete = async (durationInSeconds) => {
    if (!user || !currentSelectedTaskId) {
      setPageError("You must select a task to save a session.");
      return;
    }
    setPageError(null);

    try {
      const token = await user.getIdToken();
      const sessionData = {
        duration: durationInSeconds / 60,
        projectId: currentSelectedProjectId || null,
        taskId: currentSelectedTaskId,
        timestamp: new Date().toISOString(),
      };

      await axios.post("/api/sessions", sessionData, {
        headers: { authtoken: token },
      });
      alert("Session stored successfully!");
    } catch (err) {
      console.error("Failed to save session:", err);
      setPageError(
        err.response?.data?.message || "Failed to save your session."
      );
    }
  };

  // Don't render until the user and settings are loaded to prevent crashes
  if (isSettingsLoading || !user) {
    // Or return a loading spinner component
    return <CircularProgress size={24} color="inherit" />;
  }

  return (
    <HomePageUI
      // Pass all the necessary data and functions down to the UI component
      user={user}
      onFocusTargetsChange={handleFocusTargetsChange}
      onTimerComplete={handleTimerComplete}
      // These are needed by the children, passed through HomePageUI
      selectedTaskId={currentSelectedTaskId}
      // Other props needed for display
      pageError={pageError}
      pomodoroDuration={settings.defaultPomodoroTime}
      shortBreak={settings.defaultShortBreakTime}
      longBreak={settings.defaultLongBreakTime}
      longBreakInterval={settings.defaultLongBreakInterval}
    />
  );
};

export default HomePage;
