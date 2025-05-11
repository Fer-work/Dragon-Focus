// client/src/context/SettingsContext.jsx
import { createContext, useState } from "react";

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [pomodoroDuration, setPomodoroDuration] = useState(25);
  const [shortBreakDuration, setShortBreakDuration] = useState(5);
  const [longBreakDuration, setLongBreakDuration] = useState(15);
  const [longBreakInterval, setLongBreakInterval] = useState(4);

  const updateSettings = (newSettings) => {
    setPomodoroDuration(newSettings.pomodoroDuration);
    setShortBreakDuration(newSettings.shortBreakDuration);
    setLongBreakDuration(newSettings.longBreakDuration);
    setLongBreakInterval(newSettings.longBreakInterval);
  };

  return (
    <SettingsContext.Provider
      value={{
        pomodoroDuration,
        shortBreakDuration,
        longBreakDuration,
        longBreakInterval,
        updateSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
