import Project from "../models/Project.js";
import Task from "../models/Task.js"; // Needed for deleting tasks when a project is deleted
import FocusSession from "../models/FocusSession.js"; // Needed for handling sessions when a project is deleted

// @desc    Create a new Project
// @route   POST /api/projects
// @access  Private
export async function createProject(req, res) {
  try {
    const { name, description, color, status } = req.body;
    const userId = req.user._id; // From authMiddleware

    if (!name) {
      return res.status(400).json({ message: "Project name is required." });
    }

    const newProject = new Project({
      userId,
      name,
      description,
      color,
      status,
    });

    const savedProject = await newProject.save();
    res.status(201).json({
      message: "Project created successfully!",
      project: savedProject,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res
        .status(400)
        .json({ message: "Validation Error", errors: messages });
    }
    res
      .status(500)
      .json({ message: "Failed to create project on the server." });
  }
}

// @desc    Get all Projects for the authenticated user
// @route   GET /api/projects
// @access  Private
export async function getProjectsForUser(req, res) {
  try {
    const userId = req.user._id;
    const projects = await Project.find({ userId }).sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Failed to fetch projects." });
  }
}

// @desc    Get a single Project by ID
// @route   GET /api/projects/:projectId
// @access  Private
export async function getProjectById(req, res) {
  try {
    const userId = req.user._id;
    const projectId = req.params.projectId;

    const project = await Project.findOne({ _id: projectId, userId });

    if (!project) {
      return res
        .status(404)
        .json({ message: "Project not found or not authorized." });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid Project ID format." });
    }
    res.status(500).json({ message: "Failed to fetch project." });
  }
}

// @desc    Update a Project
// @route   PUT /api/projects/:projectId
// @access  Private
export async function updateProject(req, res) {
  try {
    const userId = req.user._id;
    const projectId = req.params.projectId;
    const updates = req.body;

    let project = await Project.findOne({ _id: projectId, userId });

    if (!project) {
      return res
        .status(404)
        .json({ message: "Project not found or not authorized." });
    }

    // Update allowed fields
    const allowedUpdates = ["name", "description", "color", "status"];
    Object.keys(updates).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        project[key] = updates[key];
      }
    });

    const updatedProject = await project.save();
    res.status(200).json({
      message: "Project updated successfully!",
      project: updatedProject,
    });
  } catch (error) {
    console.error("Error updating project:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res
        .status(400)
        .json({ message: "Validation Error", errors: messages });
    }
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid Project ID format." });
    }
    res.status(500).json({ message: "Failed to update project." });
  }
}

// @desc    Delete a Project (and its associated tasks and sessions)
// @route   DELETE /api/projects/:projectId
// @access  Private
export async function deleteProject(req, res) {
  try {
    const userId = req.user._id;
    const projectId = req.params.projectId;

    // Ensure the project belongs to the user
    const project = await Project.findOne({ _id: projectId, userId });
    if (!project) {
      return res
        .status(404)
        .json({ message: "Project not found or not authorized." });
    }

    // Transaction: Delete project, its tasks, and its focus sessions
    // For a simpler approach without transactions (if not using replica sets for MongoDB):
    // 1. Delete associated FocusSessions
    await FocusSession.deleteMany({ projectId: projectId, userId: userId });
    // 2. Delete associated Tasks
    await Task.deleteMany({ projectId: projectId, userId: userId });
    // 3. Delete the Project
    await Project.deleteOne({ _id: projectId, userId: userId });
    // Note: If using MongoDB transactions, you'd wrap these in a session.

    res
      .status(200)
      .json({ message: "Project and associated data deleted successfully." });
  } catch (error) {
    console.error("Error deleting project:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid Project ID format." });
    }
    res.status(500).json({ message: "Failed to delete project." });
  }
}

// @desc    Get all Tasks for a specific Project
// @route   GET /api/projects/:projectId/tasks
// @access  Private
export async function getTasksForProject(req, res) {
  try {
    const userId = req.user._id;
    const projectId = req.params.projectId;

    // First, verify the user owns the project
    const project = await Project.findOne({ _id: projectId, userId });
    if (!project) {
      return res
        .status(404)
        .json({ message: "Project not found or not authorized." });
    }

    // If project is owned by user, fetch its tasks
    const tasks = await Task.find({ projectId: projectId, userId: userId }) // Ensure tasks also match userId for safety
      .sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks for project:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid Project ID format." });
    }
    res.status(500).json({ message: "Failed to fetch tasks for the project." });
  }
}
