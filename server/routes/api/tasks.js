// server/routes/api/tasks.js

import { Router } from "express";
import {
  createTask,
  getTasksForUser, // Get all tasks for the authenticated user (can be filtered)
  getTaskById,
  updateTask,
  deleteTask,
} from "../../controllers/taskController.js";
import { protect } from "../../utils/authMiddleware.js"; // Example: Your auth middleware

const router = Router();

// All task routes should be protected
router.use(protect); // Example: Apply auth middleware to all task routes

router
  .route("/")
  .post(createTask) // Create a new task (categoryId should be in the request body)
  .get(getTasksForUser); // Get tasks for the authenticated user (e.g., query by categoryId: /tasks?categoryId=...)

router
  .route("/:taskId")
  .get(getTaskById) // Get a specific task by its ID
  .put(updateTask) // Update a specific task
  .delete(deleteTask); // Delete a specific task

export default router;
