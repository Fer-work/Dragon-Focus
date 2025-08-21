import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth"; // Added updateProfile
import apiClient from "../../api/apiClient.js";
import { useNotification } from "../../globalHooks/NotificationContext.jsx";
import CreateAccountForm from "./components/CreateAccountForm";

const CreateAccountPage = () => {
  const { showNotification } = useNotification();
  const [formValues, setformValues] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setformValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleCreateAccount = async (event) => {
    event.preventDefault();

    const { email, password, confirmPassword, username } = formValues;

    // --- 1. Frontend Validation ---
    if (!email || !password || !confirmPassword || !username) {
      showNotification("Please fill in all fields.", "error");
      return;
    }
    if (username.length < 3) {
      showNotification("Username must be at least 3 characters long.", "error");
      return;
    }
    if (password.length < 8) {
      showNotification("Password must be at least 8 characters long.", "error");
      return;
    }
    if (password !== confirmPassword) {
      showNotification("Passwords do not match. Please try again.", "error");
      return;
    }

    setIsLoading(true);
    showNotification("Creating your account...", "info", 2500);

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      await updateProfile(firebaseUser, { displayName: username });

      // After successful Firebase creation, sync with your backend
      await apiClient.post("/users", {
        email: firebaseUser.email,
        username: username,
      });

      navigate("/transition");
    } catch (err) {
      // --- 2. Handle Backend Errors ---
      if (err.response && err.response.status === 409) {
        // This is the specific "Username or Email taken" error from our backend
        showNotification(err.response.data.message, "error");
      } else if (err.code === "auth/email-already-in-use") {
        showNotification(
          "This email is already registered with Firebase.",
          "error"
        );
      } else {
        showNotification(
          "Failed to create account. Please try again.",
          "error"
        );
      }
      console.error("Create account error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CreateAccountForm
      formValues={formValues}
      onFormChange={handleFormChange}
      onSubmit={handleCreateAccount}
      isLoading={isLoading}
    />
  );
};

export default CreateAccountPage;
