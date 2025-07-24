// src/globalHooks/TransitionContext.jsx
import { createContext, useState, useContext } from "react";

const TransitionContext = createContext();

export const TransitionProvider = ({ children }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  // This function will be called after login/signup
  const triggerTransition = () => {
    setIsTransitioning(true);
    // The transition will last for its animation duration, then we can reset
    setTimeout(() => {
      setIsTransitioning(false);
    }, 2500); // Match your animation duration
  };

  const value = { isTransitioning, triggerTransition };

  return (
    <TransitionContext.Provider value={value}>
      {children}
    </TransitionContext.Provider>
  );
};

export const useTransition = () => {
  return useContext(TransitionContext);
};
