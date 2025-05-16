import { Router } from "express";
import {
  createProject,
  getProjectsForUser,
  getProjectById,
  updateProject,
  deleteProject,
  getTasksForProject, // To get tasks associated with a specific project
} from "../../controllers/projectController.js";
import { protect } from "../../utils/authMiddleware.js"; // Example: Your auth middleware

const router = Router();

// All project routes should be protected as they belong to a user
router.use(protect); // Example: Apply auth middleware to all project routes

router
  .route("/")
  .post(createProject) // Create a new project for the authenticated user
  .get(getProjectsForUser); // Get all projects for the authenticated user

router
  .route("/:projectId")
  .get(getProjectById) // Get a specific project by its ID
  .put(updateProject) // Update a specific project
  .delete(deleteProject); // Delete a specific project

// Route to get all tasks associated with a specific project
router.get("/:projectId/tasks", getTasksForProject);

export default router;
