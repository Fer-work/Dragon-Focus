import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import useUser from "../utils/useUser";
import "../styles/sidebar.css";

export default function Sidebar() {
  const { isLoading, user } = useUser();

  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(getAuth())
      .then(() => navigate("/"))
      .catch((error) => console.error("Sign out error:", error));
  };

  return (
    <div className="sidebar-content">
      <div className="sidebar-header">
        <h2>Dragon Focus</h2>
      </div>

      <nav className="sidebar-links">
        <Link to="/">Home</Link>

        {isLoading ? (
          <li>Loading...</li>
        ) : user ? (
          <>
            <li>
              <p>Logged in as {user.email}</p>
            </li>
            <Link to="/stats">Stats</Link>
            <Link to="/settings">Settings</Link>
            <li>
              <button onClick={handleLogout}>Sign Out</button>
            </li>
          </>
        ) : (
          <li>
            <button onClick={() => navigate("/login")}>Sign In</button>
          </li>
        )}
      </nav>

      <div className="sidebar-footer">
        {user && (
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </div>
  );
}
