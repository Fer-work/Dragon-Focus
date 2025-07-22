import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth"; // Added updateProfile
import axios from "axios"; // To sync user with your backend

// TODO: Ask why useUser import is not needed.

import CreateAccountForm from "./components/CreateAccountForm";

const CreateAccountPage = () => {
  const [formValues, setformValues] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
  });
  const [error, setError] = useState(null);
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
    setError(null);

    const { email, password, confirmPassword, username } = formValues;

    // Validation: Check that all fields are filled out and that passwords match
    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    setIsLoading(true);
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      if (username) {
        // TODO: Ask about displayName/username
        await updateProfile(firebaseUser, { displayName: username });
      }

      // After successful Firebase account creation, sync with your backend's /api/users. This ensures a user document is created in your MongoDB
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        await axios.post(
          "/api/users",
          {
            email: firebaseUser.email,
            username: username || firebaseUser.displayName, // Send username if collected
          },
          { headers: { authtoken: token } }
        );
      }
      // Navigate to home (root) page after successful account creation and backend sync
      navigate("/");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("This email address is already in use. Please try another.");
      } else if (err.code === "auth/weak-password") {
        setError(
          "Password is too weak. Please choose a stronger password (at least 6 characters)."
        );
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError("Failed to create account. Please try again later.");
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
      error={error}
    />
  );
};

export default CreateAccountPage;
