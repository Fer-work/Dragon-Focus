import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export default function CreateAccountPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState(null);

  const navigate = useNavigate();

  async function createAccount() {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await createUserWithEmailAndPassword(getAuth(), email, password);
      navigate("/articles");
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <>
      <h1>Create your account</h1>
      {error && <p>{error}</p>}
      <input
        type="text"
        placeholder="email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="confirm password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button onClick={createAccount}>Create Account</button>
      <Link to="/login">Already have an account? Log in here</Link>
    </>
  );
}
