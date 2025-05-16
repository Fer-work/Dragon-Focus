import Task from "../models/Task.js";
import Project from "../models/Project.js"; // To verify project ownership

// @desc    Create a new Task
// @route   POST /api/tasks
// @access  Private
export async function createTask(req, res) {
  try {
    const {
      name,
      description,
      projectId, // Expecting ObjectId from the client
      status,
      dueDate,
      estimatedPomodoros,
    } = req.body;

    const userId = req.user._id; // From authMiddleware

    if (!name || !projectId) {
      return res
        .status(400)
        .json({ message: "Task name and Project ID are required." });
    }

    // Verify that the project exists and belongs to the user
    const project = await Project.findOne({ _id: projectId, userId });
    if (!project) {
      return res
        .status(404)
        .json({
          message: "Project not found or user not authorized for this project.",
        });
    }

    const newTask = new Task({
      userId,
      projectId,
      name,
      description,
      status,
      dueDate,
      estimatedPomodoros,
    });

    const savedTask = await newTask.save();
    // Populate project info in the response
    const populatedTask = await Task.findById(savedTask._id).populate(
      "projectId",
      "name color"
    );

    res.status(201).json({
      message: "Task created successfully!",
      task: populatedTask || savedTask,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res
        .status(400)
        .json({ message: "Validation Error", errors: messages });
    }
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid Project ID format." });
    }
    res.status(500).json({ message: "Failed to create task on the server." });
  }
}

// @desc    Get all Tasks for the authenticated user (optionally filtered by project)
// @route   GET /api/tasks
// @route   GET /api/projects/:projectId/tasks (Handled by projectController, but this can support query filtering)
// @access  Private
export async function getTasksForUser(req, res) {
  try {
    const userId = req.user._id;
    const queryFilters = { userId };

    // If a projectId is provided in the query (e.g., /api/tasks?projectId=...)
    if (req.query.projectId) {
      queryFilters.projectId = req.query.projectId;
    }
    // You could add other filters like status: req.query.status

    const tasks = await Task.find(queryFilters)
      .populate("projectId", "name color") // Populate project details
      .sort({ createdAt: -1 }); // Sort by creation date, or dueDate, etc.

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    if (error.name === "CastError" && error.path === "projectId") {
      return res
        .status(400)
        .json({ message: "Invalid Project ID format in query." });
    }
    res.status(500).json({ message: "Failed to fetch tasks." });
  }
}

// @desc    Get a single Task by ID
// @route   GET /api/tasks/:taskId
// @access  Private
export async function getTaskById(req, res) {
  try {
    const userId = req.user._id;
    const taskId = req.params.taskId;

    const task = await Task.findOne({ _id: taskId, userId }).populate(
      "projectId",
      "name color"
    );

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

    // If projectId is being updated, verify the new project belongs to the user
    if (updates.projectId && updates.projectId !== task.projectId.toString()) {
      const project = await Project.findOne({ _id: updates.projectId, userId });
      if (!project) {
        return res
          .status(403)
          .json({
            message:
              "Cannot assign task to a project not owned by the user or project not found.",
          });
      }
      task.projectId = updates.projectId;
    }

    // Update allowed fields
    const allowedUpdates = [
      "name",
      "description",
      "status",
      "dueDate",
      "estimatedPomodoros",
      "actualPomodoros",
    ];
    Object.keys(updates).forEach((key) => {
      if (allowedUpdates.includes(key) && key !== "projectId") {
        // projectId handled separately
        task[key] = updates[key];
      }
    });

    const updatedTask = await task.save();
    const populatedTask = await Task.findById(updatedTask._id).populate(
      "projectId",
      "name color"
    );

    res.status(200).json({
      message: "Task updated successfully!",
      task: populatedTask || updatedTask,
    });
  } catch (error) {
    console.error("Error updating task:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res
        .status(400)
        .json({ message: "Validation Error", errors: messages });
    }
    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ message: "Invalid ID format for task or project." });
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

    // Optional: You might want to remove this task's ID from any FocusSessions
    // that reference it, or set their taskId to null. This depends on desired data integrity.
    // Example: await FocusSession.updateMany({ taskId: taskId }, { $set: { taskId: null } });

    res.status(200).json({ message: "Task deleted successfully." });
  } catch (error) {
    console.error("Error deleting task:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid Task ID format." });
    }
    res.status(500).json({ message: "Failed to delete task." });
  }
}
