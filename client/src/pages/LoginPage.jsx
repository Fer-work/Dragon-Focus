import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  async function logIn() {
    try {
      await signInWithEmailAndPassword(getAuth(), email, password);
      navigate("/home");
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <>
      <h1>Log into your account</h1>
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
      <button onClick={logIn}>Log In</button>
      <Link to="/create-account">Don't have an account? Create one here</Link>
    </>
  );
}
