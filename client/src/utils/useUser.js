import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Custome React hook to track Firebase authentication state
const useUser = () => {
  // isLoading helps you know when Firebase is still checking the user's auth status
  const [isLoading, setIsLoading] = useState(true);

  // Stores the authenticated user object (or null if not signed in)
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Subscribe to auth state changes - fires whenever a user logs in or out
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      setUser(user); // Update user state (null if not logged in)
      setIsLoading(false); // We're done loading once auth state is known
    });

    // Return the unsubscribe function to clean up the listener when component unmounts
    return unsubscribe;
  }, []);

  // Expose both user data and loading state to any component that uses this hook
  return { isLoading, user };
};

export default useUser;
