// src/features/home/components/Timer.jsx
import { useContext, useEffect } from "react";
import { TimerContext } from "../../../globalHooks/TimerContext";
import TimerUI from "./TimerUI";

export default function Timer({ onTimerComplete, disabled }) {
  // Get all state and functions from the global context
  const {
    timeLeft,
    isRunning,
    currentSession,
    sessionCompleted,
    setSessionCompleted,
    getDurationInSeconds,
    toggleTimer,
    resetTimer,
    changeSession,
  } = useContext(TimerContext);

  // This effect watches for the completion flag from the context
  useEffect(() => {
    if (sessionCompleted) {
      // When a session completes, call the onTimerComplete prop from HomePage
      onTimerComplete?.(getDurationInSeconds());
      // Reset the flag so this doesn't fire again
      setSessionCompleted(false);
    }
  }, [
    sessionCompleted,
    onTimerComplete,
    getDurationInSeconds,
    setSessionCompleted,
  ]);

  return (
    <TimerUI
      timeLeft={timeLeft}
      isRunning={isRunning}
      currentSession={currentSession}
      isTimerDisabled={disabled}
      onToggle={toggleTimer}
      onReset={resetTimer}
      onChangeSession={changeSession}
    />
  );
}
