// server/controllers/categoryController.js

import Category from "../models/Category.js";
import Task from "../models/Task.js"; // Needed for deleting tasks when a Category is deleted
import FocusSession from "../models/focusSession.js"; // Needed for handling sessions when a Category is deleted

// @desc    Create a new Category
// @route   POST /api/categories
// @access  Private
export async function createCategory(req, res) {
  // 1. Authorization Check
  if (!req.user) {
    return res.status(401).json({ message: "User not found in database." });
  }

  try {
    const { name, description, color, status } = req.body;
    const userId = req.user._id; // From authMiddleware

    if (!name) {
      return res.status(400).json({ message: "Category name is required." });
    }

    const newCategory = new Category({
      userId,
      name,
      description,
      color,
      status,
    });

    const savedCategory = await newCategory.save();
    res.status(201).json({
      message: "Category created successfully!",
      category: savedCategory,
    });
  } catch (error) {
    console.error("Error creating Category:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res
        .status(400)
        .json({ message: "Validation Error", errors: messages });
    }
    res
      .status(500)
      .json({ message: "Failed to create Category on the server." });
  }
}

// @desc    Get all categories for the authenticated user
// @route   GET /api/categories
// @access  Private
export async function getCategoriesForUser(req, res) {
  // 1. Authorization Check
  if (!req.user) {
    return res.status(401).json({ message: "User not found in database." });
  }

  try {
    const userId = req.user._id;
    const categories = await Category.find({ userId }).sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching /api/categories:", error);
    res.status(500).json({ message: "Failed to fetch categories." });
  }
}

// @desc    Get a single Category by ID
// @route   GET /api/categories/:categoryId
// @access  Private
export async function getCategoryById(req, res) {
  // 1. Authorization Check
  if (!req.user) {
    return res.status(401).json({ message: "User not found in database." });
  }

  try {
    const userId = req.user._id;
    const categoryId = req.params.categoryId;

    const category = await Category.findOne({ _id: categoryId, userId });

    if (!category) {
      return res
        .status(404)
        .json({ message: "Category not found or not authorized." });
    }

    res.status(200).json(category);
  } catch (error) {
    console.error("Error fetching Category by ID:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid category  ID format." });
    }
    res.status(500).json({ message: "Failed to fetch category ." });
  }
}

// @desc    Update a Category
// @route   PUT /api/categories/:categoryId
// @access  Private
export async function updateCategory(req, res) {
  // 1. Authorization Check
  if (!req.user) {
    return res.status(401).json({ message: "User not found in database." });
  }

  try {
    const userId = req.user._id;
    const categoryId = req.params.categoryId;
    const updates = req.body;

    let category = await Category.findOne({ _id: categoryId, userId });

    if (!category) {
      return res
        .status(404)
        .json({ message: "Category not found or not authorized." });
    }

    // Update allowed fields
    const allowedUpdates = ["name", "description", "color", "status"];
    Object.keys(updates).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        category[key] = updates[key];
      }
    });

    const updatedCategory = await Category.save();
    res.status(200).json({
      message: "Category updated successfully!",
      category: updatedCategory,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res
        .status(400)
        .json({ message: "Validation Error", errors: messages });
    }
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid category ID format." });
    }
    res.status(500).json({ message: "Failed to update category." });
  }
}

// @desc    Delete a Category (and its associated tasks and sessions)
// @route   DELETE /api/categories/:categoryId
// @access  Private
export async function deleteCategory(req, res) {
  // 1. Authorization Check
  if (!req.user) {
    return res.status(401).json({ message: "User not found in database." });
  }

  try {
    const userId = req.user._id;
    const categoryId = req.params.categoryId;

    // Ensure the Category belongs to the user
    const category = await Category.findOne({ _id: categoryId, userId });
    if (!category) {
      return res
        .status(404)
        .json({ message: "Category not found or not authorized." });
    }

    // Transaction: Delete Category, its tasks, and its focus sessions
    // For a simpler approach without transactions (if not using replica sets for MongoDB):
    // 1. Delete associated FocusSessions
    await FocusSession.deleteMany({ categoryId: categoryId, userId: userId });
    // 2. Delete associated Tasks
    await Task.deleteMany({ categoryId: categoryId, userId: userId });
    // 3. Delete the Category
    await Category.deleteOne({ _id: categoryId, userId: userId });
    // Note: If using MongoDB transactions, you'd wrap these in a session.

    res
      .status(200)
      .json({ message: "Category and associated data deleted successfully." });
  } catch (error) {
    console.error("Error deleting category:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid Category ID format." });
    }
    res.status(500).json({ message: "Failed to delete Category." });
  }
}

// @desc    Get all Tasks for a specific Category
// @route   GET /api/categories/:categoryId/tasks
// @access  Private
export async function getTasksForCategory(req, res) {
  if (!req.user) {
    return res.status(401).json({ message: "User not found in database." });
  }

  try {
    const userId = req.user._id;
    const categoryId = req.params.categoryId;

    // First, verify the user owns the Category
    const category = await Category.findOne({ _id: categoryId, userId });
    if (!category) {
      return res
        .status(404)
        .json({ message: "Category not found or not authorized." });
    }

    // If Category is owned by user, fetch its tasks
    const tasks = await Task.find({ categoryId: categoryId, userId: userId }) // Ensure tasks also match userId for safety
      .sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks for category:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid category ID format." });
    }
    res
      .status(500)
      .json({ message: "Failed to fetch tasks for the category." });
  }
}
