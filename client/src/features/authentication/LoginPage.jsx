// src/features/authentication/LoginPage.jsx

import { useState } from "react"; // Added useContext
import { useNavigate } from "react-router-dom";
import { useTransition } from "../../globalHooks/TransitionContext";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import LoginForm from "./components/LoginForm";

const LoginPage = () => {
  const [formValues, setformValues] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { triggerTransition } = useTransition();

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setformValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleLogin = async (event) => {
    event.preventDefault(); // Prevent default form submission
    setError(null); // Clear previous errors

    if (!formValues.email || !formValues.password) {
      setError("Please enter both email and password.");
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
      triggerTransition();
      navigate("/");
    } catch (err) {
      // Firebase provides specific error codes and messages
      if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password" ||
        err.code === "auth/invalid-credential"
      ) {
        setError("Invalid email or password. Please try again.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError("Failed to log in. Please try again later.");
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
      error={error}
    />
  );
};

export default LoginPage;
