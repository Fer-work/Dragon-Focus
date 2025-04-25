import { useState } from "react";

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [newSubcategory, setNewSubcategory] = useState("");

  const handleAddProject = () => {
    if (newProject.trim()) {
      setProjects([...projects, { name: newProject, subcategories: [] }]);
      setNewProject("");
    }
  };

  const handleAddSubcategory = () => {
    if (newSubcategory.trim() && selectedProject !== null) {
      const updatedProjects = projects.map((project, index) =>
        index === selectedProject
          ? {
              ...project,
              subcategories: [...project.subcategories, newSubcategory],
            }
          : project
      );
      setProjects(updatedProjects);
      setNewSubcategory("");
    } else if (selectedProject === null) {
      alert("Please select a project first.");
    }
  };

  return (
    <div className="header">
      <h1 className="">Welcome to Dragon Focus!</h1>
      <p>Start your pomodoro session and track your focus progress!</p>
      {/* Add New Project */}
      <div className="add-project">
        <input
          type="text"
          placeholder="New Project"
          value={newProject}
          onChange={(e) => setNewProject(e.target.value)}
        />
        <button onClick={handleAddProject}>Add Project</button>
      </div>

      {/* Project List */}
      <nav className="sidebar-nav">
        {projects.map((project, index) => (
          <div key={index}>
            <button onClick={() => setSelectedProject(index)}>
              {project.name}
            </button>
            {selectedProject === index && (
              <div className="add-subcategory">
                <input
                  type="text"
                  placeholder="New Subcategory"
                  value={newSubcategory}
                  onChange={(e) => setNewSubcategory(e.target.value)}
                />
                <button onClick={handleAddSubcategory}>Add Subcategory</button>
                <ul>
                  {project.subcategories.map((subcategory, subIndex) => (
                    <li key={subIndex}>{subcategory}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};
