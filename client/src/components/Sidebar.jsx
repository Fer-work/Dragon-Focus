import { Link } from "react-router-dom";
import "../styles/sidebar.css";

export default function Sidebar() {
  return (
    <div className="sidebar-content">
      <div className="sidebar-header">
        <h2>Dragon Focus</h2>
      </div>

      <nav className="sidebar-links">
        <Link to={"/"}>Home</Link>
        <Link to={"/stats"}>Stats</Link>
        <Link to={"/settings"}>Settings</Link>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-button">Logout</button>
      </div>
    </div>
  );
}
