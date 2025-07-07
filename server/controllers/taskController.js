import Task from "../models/Task.js";
import Project from "../models/Project.js"; // To verify project ownership
import FocusSession from "../models/FocusSession.js"; // For cascading updates on delete

// @desc    Create a new Task
// @route   POST /api/tasks
// @access  Private
export async function createTask(req, res) {
  try {
    const {
      name,
      description,
      projectId, // Optional
      status,
      dueDate,
      estimatedPomodoros,
    } = req.body;

    const userId = req.user._id; // From authMiddleware

    if (!name) {
      return res.status(400).json({ message: "Task name is required." });
    }

    // If a projectId is provided, we must verify it exists and belongs to the user.
    if (projectId) {
      const projectExists = await Project.findOne({ _id: projectId, userId });
      if (!projectExists) {
        return res.status(404).json({
          message: "Project not found or you are not authorized.",
        });
      }
    }

    // --- CREATION ---
    const newTask = new Task({
      userId,
      name,
      projectId: projectId || null, // Assign projectId if provided, otherwise null
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
// @route   GET /api/projects/:projectId/tasks (Handled by projectController, but this can support query filtering)
// @access  Private
export async function getTasksForUser(req, res) {
  try {
    const userId = req.user._id;
    const { projectId, unassigned } = req.query;
    const queryFilters = { userId };

    // Filter by a specific project ID.
    if (projectId) {
      queryFilters.projectId = projectId;
    }

    // Add a filter to find tasks that do NOT have a project.
    // e.g., /api/tasks?unassigned=true
    if (unassigned === "true") {
      queryFilters.projectId = null;
    }

    const tasks = await Task.find(queryFilters)
      .populate("projectId", "name color") // Populate project details
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
    }).populate("projectId", "name color");

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
    if ("projectId" in updates) {
      const newProjectId = updates.projectId;
      // If the new ID is not null (i.e., we are assigning/changing a project)
      if (newProjectId) {
        const project = await Project.findOne({ _id: newProjectId, userId });
        if (!project) {
          return res.status(403).json({
            message: "Cannot assign task to a project that is not yours.",
          });
        }
        task.projectId = newProjectId;
        // Also update all existing sessions for this task to reflect the new project.
        await FocusSession.updateMany(
          { taskId: task._id },
          { $set: { projectId: newProjectId } }
        );
      } else {
        // If projectId is explicitly set to null, un-assign it.
        task.projectId = null;
        // Update historical sessions to also be un-assigned from the project.
        await FocusSession.updateMany(
          { taskId: task._id },
          { $set: { projectId: null } }
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
      "projectId",
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
