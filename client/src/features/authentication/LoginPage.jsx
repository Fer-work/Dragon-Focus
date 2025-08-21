// src/features/authentication/LoginPage.jsx

import { useState } from "react"; // Added useContext
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNotification } from "../../globalHooks/NotificationContext";
import LoginForm from "./components/LoginForm";

const LoginPage = () => {
  const { showNotification } = useNotification();
  const [formValues, setformValues] = useState({
    email: "",
    password: "",
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

  const handleLogin = async (event) => {
    event.preventDefault(); // Prevent default form submission

    if (!formValues.email || !formValues.password) {
      showNotification("Please enter both email and password.", "error");
      return;
    }

    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(
        getAuth(),
        formValues.email,
        formValues.password
      );

      // On success, trigger the transition
      navigate("/transition");
    } catch (err) {
      // Firebase provides specific error codes and messages
      if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password" ||
        err.code === "auth/invalid-credential"
      ) {
        showNotification("Invalid email or password. Please try again.");
      } else if (err.code === "auth/invalid-email") {
        showNotification("Please enter a valid email address.", "error");
      } else {
        showNotification("Failed to log in. Please try again later.", "error");
      }
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginForm
      formValues={formValues}
      onFormChange={handleFormChange}
      onSubmit={handleLogin}
      isLoading={isLoading}
    />
  );
};

export default LoginPage;
