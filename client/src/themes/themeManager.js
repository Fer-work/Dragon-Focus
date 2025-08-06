// src/themes/themeManager.js
import { useState, useMemo, createContext } from "react";
// 1. Import the central 'themes' object from the index file.
import { themes } from "./index.js";

export const ColorModeContext = createContext({
  // Provide a default structure for autocompletion
  toggleColorMode: () => {},
  currentMode: "flame",
});

export const useMode = () => {
  // 2. The state logic remains the same, defaulting to 'flame'.
  const [mode, setMode] = useState(() => {
    return localStorage.getItem("themeMode") || "flame";
  });

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        // This logic allows switching between your two current themes.
        const newMode = mode === "flame" ? "jungle" : "flame";
        localStorage.setItem("themeMode", newMode);
        setMode(newMode);
      },
      currentMode: mode,
    }),
    [mode]
  );

  // 3. This is the key change: Select the entire theme object from the
  //    'themes' collection based on the current mode name (e.g., themes['flame']).
  const theme = useMemo(() => themes[mode], [mode]);

  return [theme, colorMode];
};
