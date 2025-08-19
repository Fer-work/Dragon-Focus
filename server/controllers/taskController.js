//
import Task from "../models/Task.js";
import Category from "../models/Category.js"; // To verify project ownership
import FocusSession from "../models/focusSession.js"; // For cascading updates on delete

// @desc    Create a new Task
// @route   POST /api/tasks
// @access  Private
export async function createTask(req, res) {
  // 1. Authorization Check
  if (!req.user) {
    return res.status(401).json({ message: "User not found in database." });
  }

  try {
    const {
      name,
      description,
      categoryId,
      status,
      color,
      dueDate,
      estimatedPomodoros,
    } = req.body;
    const userId = req.user._id;

    if (!name) {
      return res.status(400).json({ message: "Task name is required." });
    }

    // If a categoryId is provided, verify it exists and belongs to the user for data integrity.
    if (categoryId) {
      const categoryExists = await Category.findOne({
        _id: categoryId,
        userId,
      });
      if (!categoryExists) {
        return res
          .status(404)
          .json({ message: "Category not found or you are not authorized." });
      }
    }

    const newTask = new Task({
      userId,
      name,
      categoryId: categoryId || null,
      description,
      status,
      dueDate,
      color,
      estimatedPomodoros,
    });

    const savedTask = await newTask.save();
    const populatedTask = await Task.findById(savedTask._id).populate(
      "categoryId",
      "name color"
    );

    res.status(201).json({
      message: "Task created successfully!",
      task: populatedTask,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res
        .status(400)
        .json({ message: "Validation Error", errors: messages });
    }

    res.status(500).json({ message: "Failed to create task on the server." });
  }
}

// @desc    Get all Tasks for the authenticated user (optionally filtered by project)
// @route   GET /api/tasks
// @route   GET /api/projects/:categoryId/tasks (Handled by projectController, but this can support query filtering)
// @access  Private
export async function getTasksForUser(req, res) {
  if (!req.user) {
    return res.status(401).json({ message: "User not found in database." });
  }

  try {
    const userId = req.user._id;
    const { categoryId, unassigned } = req.query;
    const queryFilters = { userId };

    // Filter by a specific project ID.
    if (categoryId) {
      queryFilters.categoryId = categoryId;
    } else if (unassigned === "true") {
      queryFilters.categoryId = null;
    }

    const tasks = await Task.find(queryFilters)
      .populate("categoryId", "name color") // Populate project details
      .sort({ createdAt: -1 }); // Sort by creation date, or dueDate, etc.

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Failed to fetch tasks." });
  }
}

// @desc    Get a single Task by ID
// @route   GET /api/tasks/:taskId
// @access  Private
export async function getTaskById(req, res) {
  if (!req.user) {
    return res.status(401).json({ message: "User not found in database." });
  }

  try {
    const task = await Task.findOne({
      _id: req.params.taskId,
      userId: req.user._id,
    }).populate("categoryId", "name color");

    if (!task) {
      return res
        .status(404)
        .json({ message: "Task not found or not authorized." });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error("Error fetching task by ID:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid Task ID format." });
    }
    res.status(500).json({ message: "Failed to fetch task." });
  }
}

// @desc    Update a Task
// @route   PUT /api/tasks/:taskId
// @access  Private
export async function updateTask(req, res) {
  if (!req.user) {
    return res.status(401).json({ message: "User not found in database." });
  }

  try {
    const userId = req.user._id;
    const taskId = req.params.taskId;
    const updates = req.body; // Contains fields to update

    // Ensure the task exists and belongs to the user
    let task = await Task.findOne({ _id: taskId, userId });

    if (!task) {
      return res
        .status(404)
        .json({ message: "Task not found or not authorized." });
    }

    // Handle category assignment changes
    if ("categoryId" in updates) {
      const newCategoryId = updates.categoryId;
      // If the new ID is not null (i.e., we are assigning/changing a project)
      if (newCategoryId) {
        const category = await Category.findOne({ _id: newCategoryId, userId });
        if (!category) {
          return res.status(403).json({
            message: "Cannot assign task to a category that is not yours.",
          });
        }
        task.categoryId = newCategoryId;
        // Also update all existing sessions for this task to reflect the new project.
        await FocusSession.updateMany(
          { taskId: task._id },
          { $set: { categoryId: newCategoryId } }
        );
      } else {
        // If categoryIdis explicitly set to null, un-assign it.
        task.categoryId = null;
        // Update historical sessions to also be un-assigned from the project.
        await FocusSession.updateMany(
          { taskId: task._id },
          { $set: { categoryId: null } }
        );
      }
    }

    // Update other allowed fields
    const allowedUpdates = [
      "name",
      "description",
      "status",
      "dueDate",
      "estimatedPomodoros",
      "actualPomodoros",
      "color",
    ];
    for (const key of allowedUpdates) {
      if (key in updates) {
        task[key] = updates[key];
      }
    }

    const updatedTask = await task.save();
    const populatedTask = await Task.findById(updatedTask._id).populate(
      "categoryId",
      "name color"
    );

    res.status(200).json({
      message: "Task updated successfully!",
      task: populatedTask,
    });
  } catch (error) {
    console.error("Error updating task:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res
        .status(400)
        .json({ message: "Validation Error", errors: messages });
    }

    res.status(500).json({ message: "Failed to update task." });
  }
}

// @desc    Delete a Task
// @route   DELETE /api/tasks/:taskId
// @access  Private
export async function deleteTask(req, res) {
  if (!req.user) {
    return res.status(401).json({ message: "User not found in database." });
  }

  try {
    const { taskId } = req.params;
    const userId = req.user._id;

    // Ensure the task belongs to the user before deleting
    const task = await Task.findOneAndDelete({ _id: taskId, userId });

    if (!task) {
      return res
        .status(404)
        .json({ message: "Task not found or not authorized." });
    }

    // --- DATA INTEGRITY ---
    // When a task is deleted, we should also delete all focus sessions
    // associated with it to prevent orphaned data.
    await FocusSession.deleteMany({ taskId: taskId });

    res.status(200).json({
      message: "Task and all its associated sessions deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting task:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid Task ID format." });
    }
    res.status(500).json({ message: "Failed to delete task." });
  }
}
