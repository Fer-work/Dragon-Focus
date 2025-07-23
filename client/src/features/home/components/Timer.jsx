// src/features/home/components/Timer.jsx
import { useState, useEffect, useRef } from "react";
import { SettingsContext } from "../../settings/hooks/SettingsContext";
import TimerUI from "./TimerUI";

export default function Timer({
  onTimerComplete,
  disabled: timerDisabledProp, // Renaming for clarity inside the component
  pomodoroDuration,
  shortBreakDuration,
  longBreakDuration,
}) {
  // State and Logic are kept here
  const [secondsLeft, setSecondsLeft] = useState(pomodoroDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [currentSession, setCurrentSession] = useState("pomodoro");
  const intervalRef = useRef(null);

  // This effect resets the timer's duration when the session type changes
  useEffect(() => {
    let newDuration;
    switch (currentSession) {
      case "pomodoro":
        newDuration = pomodoroDuration * 60;
        break;
      case "shortBreak":
        newDuration = shortBreakDuration * 60;
        break;
      case "longBreak":
        newDuration = longBreakDuration * 60;
        break;
      default:
        newDuration = pomodoroDuration * 60;
    }
    setSecondsLeft(newDuration);
    // If the session changes while running, stop the timer
    setIsRunning(false);
  }, [currentSession, pomodoroDuration, shortBreakDuration, longBreakDuration]);

  // This effect handles the actual countdown interval
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            // Calculate the duration of the session that just finished
            const completedDuration =
              currentSession === "pomodoro"
                ? pomodoroDuration * 60
                : currentSession === "shortBreak"
                ? shortBreakDuration * 60
                : longBreakDuration * 60;
            onTimerComplete?.(completedDuration);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    // Cleanup function to clear the interval
    return () => clearInterval(intervalRef.current);
  }, [
    isRunning,
    onTimerComplete,
    currentSession,
    pomodoroDuration,
    shortBreakDuration,
    longBreakDuration,
  ]);

  // --- Handlers passed down to the UI ---
  const toggleTimer = () => setIsRunning((prev) => !prev);
  const resetTimer = () => {
    setIsRunning(false);
    // Trigger the reset effect by re-setting the current session
    setCurrentSession((prev) => prev);
    let newDuration;
    switch (currentSession) {
      case "pomodoro":
        newDuration = pomodoroDuration * 60;
        break;
      case "shortBreak":
        newDuration = shortBreakDuration * 60;
        break;
      case "longBreak":
        newDuration = longBreakDuration * 60;
        break;
      default:
        newDuration = pomodoroDuration * 60;
    }
    setSecondsLeft(newDuration);
  };
  const changeSession = (sessionType) => setCurrentSession(sessionType);

  // Utility to format time for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <TimerUI
      timeLeft={formatTime(secondsLeft)}
      isRunning={isRunning}
      currentSession={currentSession}
      isTimerDisabled={timerDisabledProp}
      onToggle={toggleTimer}
      onReset={resetTimer}
      onChangeSession={changeSession}
    />
  );
}
