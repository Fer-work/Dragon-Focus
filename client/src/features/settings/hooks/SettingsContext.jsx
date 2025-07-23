import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";
import axios from "axios";
import useUser from "../../../globalHooks/useUser";

const defaultSettings = {
  pomodoroDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
};

const defaultContextValue = {
  settings: defaultSettings,
  isSettingsLoading: true,
  error: null,
  updateSettings: async () => {},
};

export const SettingsContext = createContext(defaultContextValue);

export const SettingsProvider = ({ children }) => {
  const { user } = useUser();
  const [settings, setSettings] = useState(defaultSettings);
  const [isSettingsLoading, setIsSettingsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // This data fetching logic is now perfect.
    const fetchSettings = async () => {
      if (!user) {
        setSettings(defaultSettings);
        setIsSettingsLoading(false);
        return;
      }
      try {
        const token = await user.getIdToken();
        const response = await axios.get("/api/users/me", {
          headers: { authtoken: token },
        });
        if (response.data && response.data.preferences) {
          setSettings((prev) => ({ ...prev, ...response.data.preferences }));
        }
      } catch (err) {
        console.error("Failed to fetch settings:", err);
        setError("Could not load saved settings. Using defaults.");
      } finally {
        setIsSettingsLoading(false);
      }
    };
    fetchSettings();
  }, [user]);

  // --- Key Fix: Correct the updateSettings function ---
  const updateSettings = useCallback(
    async (newSettings) => {
      if (!user) {
        setError("You must be logged in to save settings.");
        return { success: false, error: "User not authenticated." };
      }

      try {
        // 1. Save the new settings to the database
        const token = await user.getIdToken();
        await axios.put("/api/users/me", newSettings, {
          headers: { authtoken: token },
        });

        // 2. On success, update the local state by merging the new settings
        setSettings((currentSettings) => ({
          ...currentSettings,
          ...newSettings,
        }));

        return { success: true };
      } catch (err) {
        console.error("Failed to update settings:", err);
        const errorMessage =
          err.response?.data?.message || "Failed to save settings.";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [user]
  );

  const value = {
    settings,
    isSettingsLoading,
    error,
    updateSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  return useContext(SettingsContext);
};
