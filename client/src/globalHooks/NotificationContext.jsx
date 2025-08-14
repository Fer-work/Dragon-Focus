// src/globalHooks/NotificationContext.jsx
import React, { createContext, useState, useCallback, useContext } from "react";

// 1. Define the default shape of our context
const NotificationContext = createContext({
  notification: null, // Will be an object like { message, type }
  showNotification: () => {},
  hideNotification: () => {},
});

// 2. Create the Provider component that will wrap our app
export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);

  // Function to hide the notification
  const hideNotification = useCallback(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setNotification(null);
  }, [timeoutId]);

  // Function that any component can call to show a message
  const showNotification = useCallback(
    (message, type = "info", duration = 7000) => {
      // If a notification is already showing, clear its timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      setNotification({ message, type });

      // Set a timer to automatically hide the notification
      const newTimeoutId = setTimeout(() => {
        hideNotification();
      }, duration);
      setTimeoutId(newTimeoutId);
    },
    [hideNotification, timeoutId]
  );

  const value = { notification, showNotification, hideNotification };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// 3. Create a custom hook for easy access to the context
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};
