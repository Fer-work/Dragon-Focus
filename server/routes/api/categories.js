// server/routes/api/categories.js

import { Router } from "express";
import {
  createCategory,
  getCategoriesForUser,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getTasksForCategory, // To get tasks associated with a specific category
} from "../../controllers/categoryController.js";
import { protect } from "../../utils/authMiddleware.js"; // Example: Your auth middleware

const router = Router();

// All category routes should be protected as they belong to a user
router.use(protect); // Example: Apply auth middleware to all category routes

router
  .route("/")
  .post(createCategory) // Create a new category for the authenticated user
  .get(getCategoriesForUser); // Get all categories for the authenticated user

router
  .route("/:categoryId")
  .get(getCategoryById) // Get a specific category by its ID
  .put(updateCategory) // Update a specific category
  .delete(deleteCategory); // Delete a specific category

// Route to get all tasks associated with a specific category
router.get("/:categoryId/tasks", getTasksForCategory);

export default router;
