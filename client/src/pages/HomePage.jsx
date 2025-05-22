// src/pages/HomePage.jsx
import { useState, useContext, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Grid,
  Alert, // For page-level errors if FocusSetup doesn't handle all
  useTheme,
} from "@mui/material";

// Assuming Timer is in src/components/HomeComponents/Timer.jsx
import Timer from "../components/HomeComponents/Timer";
// Import the new FocusSetup component
import FocusSetup from "../components/HomeComponents/FocusSetup";

import useUser from "../utils/useUser";
import { SettingsContext } from "../utils/SettingsContext";
import "../styles/home.css";

const HomePage = () => {
  const { pomodoroDuration } = useContext(SettingsContext);
  const { user } = useUser();
  const theme = useTheme();

  // State managed by HomePage
  const [currentSelectedProjectId, setCurrentSelectedProjectId] = useState("");
  const [currentSelectedTaskId, setCurrentSelectedTaskId] = useState("");
  const [sessionLogs, setSessionLogs] = useState([]);
  const [pageError, setPageError] = useState(null); // For errors not handled by FocusSetup or from session saving

  // Callback for FocusSetup to update HomePage about selections
  const handleFocusTargetsChange = useCallback((projectId, taskId) => {
    setCurrentSelectedProjectId(projectId);
    setCurrentSelectedTaskId(taskId);
  }, []);

  // Callback for FocusSetup to report critical errors if needed
  const handleFocusSetupError = useCallback((errorMessage) => {
    setPageError(errorMessage);
  }, []);

  // --- Authentication Token Logging (can be removed if not needed for debugging) ---
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

  // --- Timer Complete Handler ---
  const handleTimerComplete = async (durationInSeconds) => {
    if (!user) {
      setPageError("You must be logged in to save a session.");
      return;
    }
    if (!currentSelectedProjectId) {
      setPageError("Please select a project to log this session.");
      return;
    }

    const durationInMinutes = durationInSeconds / 60;
    const timestamp = new Date().toISOString();
    const token = await user.getIdToken();
    const headers = { authtoken: token };

    const sessionData = {
      timestamp,
      duration: durationInMinutes,
      projectId: currentSelectedProjectId,
      taskId: currentSelectedTaskId || null,
    };

    console.log("Attempting to save session:", sessionData);
    setPageError(null); // Clear previous errors

    try {
      const response = await axios.post("/api/sessions", sessionData, {
        headers,
      });
      console.log("Session saved:", response.data);
      // Assuming response.data contains the saved session, potentially with populated project/task names
      // You might need to adjust this based on your actual API response
      const newLog = response.data.session || response.data;

      // If project/task names aren't populated, you might need to fetch them or store names earlier
      // For simplicity, we'll assume the backend might populate basic info or you'll handle display
      setSessionLogs((prevLogs) => [newLog, ...prevLogs]); // Add to top for recent first
    } catch (err) {
      console.error("Failed to save session:", err);
      setPageError(
        err.response?.data?.message ||
          "Failed to save your session. Please try again."
      );
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        p: { xs: 1, sm: 2, md: 3 },
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row", // Default for container
        }}
      >
        {/* Left Column: Focus Setup */}
        <Grid
          item
          xs={12}
          md={5}
          lg={4}
          sx={{
            display: "flex",
            flex: 1, // Let Grid sizing handle this
            width: "100%", // Ensure it takes space
            height: "100%", // Or adjust as needed; 'auto' might be better if content drives height
          }}
        >
          <FocusSetup
            user={user}
            onFocusTargetsChange={handleFocusTargetsChange}
            onPageError={handleFocusSetupError} // Optional: if FocusSetup needs to bubble up errors
          />
        </Grid>

        {/* Right Column: Timer */}
        <Grid
          item
          xs={12}
          md={7}
          lg={8}
          sx={{
            // flex: 2, // Let Grid sizing handle this
            display: "flex",
            flexDirection: "column",
            flex: 2,
            height: "100%",
          }}
        >
          <Box
            sx={{
              bgcolor: "background.paper",
              borderRadius: 3,
              boxShadow: "0px 5px 15px rgba(0,0,0,0.3)",
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              border: (theme) => `2px solid ${theme.palette.neutral[500]}`,
            }}
          >
            {pageError &&
              !theme.palette.mode && ( // Only show general page errors if FocusSetup doesn't show its own for the same thing
                <Alert
                  severity="error"
                  sx={{
                    mb: 2,
                    position: "absolute",
                    top: "10px",
                    width: "calc(100% - 40px)" /* Adjust based on padding */,
                  }}
                  onClose={() => setPageError(null)}
                >
                  {pageError}
                </Alert>
              )}
            <Timer
              key={currentSelectedProjectId + "-" + currentSelectedTaskId}
              pomodoroDurationProp={pomodoroDuration}
              onTimerComplete={handleTimerComplete}
              disabled={!currentSelectedProjectId}
            />
          </Box>
        </Grid>
      </Grid>
      {/* Modals are now inside FocusSetup and will render there */}
    </Box>
  );
};

export default HomePage;
