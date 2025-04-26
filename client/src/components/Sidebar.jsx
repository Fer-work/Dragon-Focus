import "../styles/sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar-content">
      <div className="sidebar-header">
        <h2>Dragon Focus</h2>
      </div>

      <nav className="sidebar-links">
        <a href="#">Home</a>
        <a href="#">Stats</a>
        <a href="#">Settings</a>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-button">Logout</button>
      </div>
    </div>
  );
};

export default Sidebar;
