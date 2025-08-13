// src/contexts/TimerContext.jsx
import { createContext, useState, useEffect, useRef, useContext } from "react";
import { SettingsContext } from "../features/settings/hooks/SettingsContext";
import { playSound } from "../utils/SoundManager.js";

export const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const { settings } = useContext(SettingsContext);

  // --- NEW TIMESTAMP-BASED STATE ---
  // The target time when the current session should end.
  const [endTime, setEndTime] = useState(null);
  // The amount of time left (in ms) when the timer was paused.
  const [remainingTimeOnPause, setRemainingTimeOnPause] = useState(0);

  // --- EXISTING STATE ---
  const [isRunning, setIsRunning] = useState(false);
  const [currentSession, setCurrentSession] = useState("pomodoro");
  // This state is now purely for display purposes.
  const [secondsLeft, setSecondsLeft] = useState(0);
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
    // Reset all timer-running state
    setIsRunning(false);
    setEndTime(null);
    setRemainingTimeOnPause(0);
  }, [currentSession, settings]);

  // --- NEW CORE COUNTDOWN LOGIC ---
  // This effect handles the interval, which now just updates the display
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        const newSecondsLeft = Math.round((endTime - Date.now()) / 1000);

        if (newSecondsLeft <= 0) {
          clearInterval(intervalRef.current);
          setIsRunning(false);
          setEndTime(null);
          setSecondsLeft(0);
          playSound("stop");
          setSessionCompleted(true);
        } else {
          setSecondsLeft(newSecondsLeft);
        }
      }, 500); // Update twice a second for smoother display
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, endTime]);

  const toggleTimer = () => {
    if (isRunning) {
      // --- PAUSING ---
      playSound("stop");
      // Calculate and store the remaining time
      setRemainingTimeOnPause(endTime - Date.now());
      setEndTime(null);
    } else {
      // --- STARTING or RESUMING ---
      playSound("start");
      // If resuming, use the stored remaining time. Otherwise, calculate from full duration.
      const durationMs =
        remainingTimeOnPause > 0
          ? remainingTimeOnPause
          : getDurationInSeconds() * 1000;

      setEndTime(Date.now() + durationMs);
      setRemainingTimeOnPause(0); // Clear the paused time
    }
    setIsRunning((prev) => !prev);
  };

  const resetTimer = () => {
    if (isRunning) playSound("stop");
    setIsRunning(false);
    setEndTime(null);
    setRemainingTimeOnPause(0);
    // Reset the display to the full duration for the current session
    setSecondsLeft(getDurationInSeconds());
  };

  const changeSession = (sessionType) => {
    if (!isRunning) {
      setCurrentSession(sessionType);
    }
  };

  const getDurationInSeconds = () => {
    switch (currentSession) {
      case "pomodoro":
        return settings.pomodoroDuration * 60;
      case "shortBreak":
        return settings.shortBreakDuration * 60;
      case "longBreak":
        return settings.longBreakDuration * 60;
      default:
        return settings.pomodoroDuration * 60;
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
    setSessionCompleted,
    getDurationInSeconds,
    toggleTimer,
    resetTimer,
    changeSession,
  };

  return (
    <TimerContext.Provider value={value}>{children}</TimerContext.Provider>
  );
};
