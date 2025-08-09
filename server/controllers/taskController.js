//
import Task from "../models/Task.js";
import Category from "../models/Category.js"; // To verify project ownership
import FocusSession from "../models/focusSession.js"; // For cascading updates on delete

// @desc    Create a new Task
// @route   POST /api/tasks
// @access  Private
export async function createTask(req, res) {
  try {
    const {
      name,
      description,
      categoryId, // Optional
      status,
      color,
      dueDate,
      estimatedPomodoros,
    } = req.body;

    const userId = req.user._id; // From authMiddleware

    if (!name) {
      return res.status(400).json({ message: "Task name is required." });
    }

    // TODO: revise the block of code below. Why would we need to check a project id? The user should only be able to see projects that belong to them anyway. Showing any other would be a bad UX. Perhaps it's a double check to make check the data integrity from the database?
    // If a categoryIdis provided, we must verify it exists and belongs to the user.
    if (categoryId) {
      const projectExists = await Category.findOne({ _id: categoryId, userId });
      if (!projectExists) {
        return res.status(404).json({
          message: "Category not found or you are not authorized.",
        });
      }
    }

    // --- CREATION ---
    const newTask = new Task({
      userId,
      name,
      categoryId: categoryId || null, // Assign categoryIdif provided, otherwise null
      description,
      status,
      dueDate,
      color,
      estimatedPomodoros,
    });

    const savedTask = await newTask.save();

    // TODO: What exactly is this doing? Is this going into the Category schema?
    // Populate project info in the response
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
  try {
    const userId = req.user._id;
    // TODO: What is unassigned doing?
    const { categoryId, unassigned } = req.query;
    const queryFilters = { userId };

    // Filter by a specific project ID.
    if (categoryId) {
      queryFilters.categoryId = categoryId;
    }

    // Add a filter to find tasks that do NOT have a project.
    // e.g., /api/tasks?unassigned=true
    if (unassigned === "true") {
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

    // --- HANDLE PROJECT ASSIGNMENT ---
    // This logic allows assigning, changing, or un-assigning a project.
    if ("categoryId" in updates) {
      const newCategoryId = updates.newCategoryId;
      // If the new ID is not null (i.e., we are assigning/changing a project)
      if (newCategoryId) {
        const project = await Category.findOne({ _id: newCategoryId, userId });
        if (!project) {
          return res.status(403).json({
            message: "Cannot assign task to a project that is not yours.",
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

    // --- UPDATE OTHER FIELDS ---
    const allowedUpdates = [
      "name",
      "description",
      "status",
      "dueDate",
      "estimatedPomodoros",
      "actualPomodoros",
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
  try {
    const userId = req.user._id;
    const taskId = req.params.taskId;

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
