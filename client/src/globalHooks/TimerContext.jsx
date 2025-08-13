// src/contexts/TimerContext.jsx
import { createContext, useState, useEffect, useRef, useContext } from "react";
import { SettingsContext } from "../features/settings/hooks/SettingsContext";
import { playSound } from "../utils/soundManager";

export const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const { settings } = useContext(SettingsContext);

  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [currentSession, setCurrentSession] = useState("pomodoro");
  const [sessionCompleted, setSessionCompleted] = useState(false);

  const intervalRef = useRef(null);

  // Effect to initialize and reset the timer when settings or session type change
  useEffect(() => {
    let newDuration;
    switch (currentSession) {
      case "pomodoro":
        newDuration = settings.pomodoroDuration * 60;
        break;
      case "shortBreak":
        newDuration = settings.shortBreakDuration * 60;
        break;
      case "longBreak":
        newDuration = settings.longBreakDuration * 60;
        break;
      default:
        newDuration = settings.pomodoroDuration * 60;
    }
    setSecondsLeft(newDuration);
    setIsRunning(false); // Stop the timer on any change
  }, [currentSession, settings]);

  // Effect to handle the countdown interval
  useEffect(() => {
    if (isRunning) {
      playSound("start");
      setSessionCompleted(false); // Reset completion flag
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            playSound("stop");
            setSessionCompleted(true); // Set completion flag
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const toggleTimer = () => {
    if (isRunning) playSound("stop");
    setIsRunning((prev) => !prev);
  };

  const resetTimer = () => {
    if (isRunning) playSound("stop");
    setIsRunning(false);
    // Re-trigger the setup effect to reset to the current session's duration
    setCurrentSession((prev) => prev);
    let newDuration;
    switch (currentSession) {
      case "pomodoro":
        newDuration = settings.pomodoroDuration * 60;
        break;
      case "shortBreak":
        newDuration = settings.shortBreakDuration * 60;
        break;
      case "longBreak":
        newDuration = settings.longBreakDuration * 60;
        break;
      default:
        newDuration = settings.pomodoroDuration * 60;
    }
    setSecondsLeft(newDuration);
  };

  const changeSession = (sessionType) => {
    if (!isRunning) {
      setCurrentSession(sessionType);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const value = {
    timeLeft: formatTime(secondsLeft),
    isRunning,
    currentSession,
    sessionCompleted,
    setSessionCompleted, // Expose setter to allow consumers to reset the flag
    getDurationInSeconds: () => {
      // Helper to get the full duration for logging
      switch (currentSession) {
        case "pomodoro":
          return settings.pomodoroDuration * 60;
        case "shortBreak":
          return settings.shortBreakDuration * 60;
        case "longBreak":
          return settings.longBreakDuration * 60;
        default:
          return 0;
      }
    },
    toggleTimer,
    resetTimer,
    changeSession,
  };

  return (
    <TimerContext.Provider value={value}>{children}</TimerContext.Provider>
  );
};
