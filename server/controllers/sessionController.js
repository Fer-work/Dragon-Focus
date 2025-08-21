import FocusSession from "../models/focusSession.js";
import Task from "../models/Task.js"; // For default task logic

// @desc    Create a new Focus Session
// @route   POST /api/sessions
// @access  Private (requires authentication)
export async function createSession(req, res) {
  // 1. Authorization Check
  if (!req.user) {
    return res.status(401).json({ message: "User not found in database." });
  }

  try {
    const {
      taskId, // Expecting a mandatory ObjectId from the client
      duration, // Mandatory duration
      timestamp, // Optional: defaults to now
      notes, // Optional
    } = req.body;

    const userId = req.user._id;

    if (!taskId || !duration) {
      return res
        .status(400)
        .json({ message: "Task ID and duration are required." });
    }

    // Find the task to ensure it exists and belongs to the user
    const task = await Task.findOne({ _id: taskId, userId });
    if (!task) {
      return res
        .status(404)
        .json({ message: "Task not found or you are not authorized." });
    }

    // Create the new session, inheriting categoryId from the task
    const newSession = new FocusSession({
      userId,
      taskId: task._id,
      categoryId: task.categoryId,
      duration,
      timestamp: timestamp || new Date(),
      notes,
    });

    const savedSession = await newSession.save();

    // 4. Populate and respond
    const populatedSession = await FocusSession.findById(savedSession._id)
      .populate("categoryId", "name color")
      .populate("taskId", "name");

    res.status(201).json({
      message: "Focus session saved successfully!",
      session: populatedSession,
    });
  } catch (error) {
    console.error("Error creating session:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res
        .status(400)
        .json({ message: "Validation Error", errors: messages });
    }
    res.status(500).json({ message: "Failed to save session on the server." });
  }
}

// @desc    Get all Focus Sessions for the authenticated user
// @route   GET /api/sessions
// @access  Private
export async function getSessionsForUser(req, res) {
  if (!req.user) {
    return res.status(401).json({ message: "User not found in database." });
  }

  try {
    const userId = req.user._id;
    const queryFilters = { userId };
    if (req.query.categoryId) {
      queryFilters.categoryId = req.query.categoryId;
    }

    const sessions = await FocusSession.find(queryFilters)
      .populate("categoryId", "name color")
      .populate("taskId", "name")
      .sort({ timestamp: -1 });

    res.status(200).json(sessions);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    res.status(500).json({ message: "Failed to fetch sessions." });
  }
}

// @desc    Get a single Focus Session by ID
// @route   GET /api/sessions/:id
// @access  Private
export async function getSessionById(req, res) {
  if (!req.user) {
    return res.status(401).json({ message: "User not found in database." });
  }

  try {
    const session = await FocusSession.findOne({
      _id: req.params.id,
      userId: req.user._id,
    })
      .populate("categoryId", "name color")
      .populate("taskId", "name");

    if (!session) {
      return res
        .status(404)
        .json({ message: "Focus session not found or not authorized." });
    }

    res.status(200).json(session);
  } catch (error) {
    console.error("Error fetching session by ID:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid session ID format." });
    }
    res.status(500).json({ message: "Failed to fetch session." });
  }
}

// @desc    Update a Focus Session
// @route   PUT /api/sessions/:id
// @access  Private
export async function updateSession(req, res) {
  if (!req.user) {
    return res.status(401).json({ message: "User not found in database." });
  }

  try {
    const { timestamp, duration, notes } = req.body;

    const session = await FocusSession.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!session) {
      return res
        .status(404)
        .json({ message: "Focus session not found or not authorized." });
    }

    // A session's task and category are tied to the task itself and shouldn't be updated here.
    // If a task's category changes, you would update the Task, not the session record.
    if (timestamp) session.timestamp = timestamp;
    if (duration) session.duration = duration;
    if (notes !== undefined) session.notes = notes;

    const updatedSession = await session.save();

    const populatedSession = await FocusSession.findById(updatedSession._id)
      .populate("categoryId", "name color")
      .populate("taskId", "name");

    res.status(200).json({
      message: "Focus session updated successfully!",
      session: populatedSession,
    });
  } catch (error) {
    console.error("Error updating session:", error);
    res.status(500).json({ message: "Failed to update session." });
  }
}

// @desc    Delete a Focus Session
// @route   DELETE /api/sessions/:id
// @access  Private
export async function deleteSession(req, res) {
  if (!req.user) {
    return res.status(401).json({ message: "User not found in database." });
  }

  try {
    const session = await FocusSession.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!session) {
      return res
        .status(404)
        .json({ message: "Focus session not found or not authorized." });
    }

    res.status(200).json({ message: "Focus session deleted successfully." });
  } catch (error) {
    console.error("Error deleting session:", error);
    res.status(500).json({ message: "Failed to delete session." });
  }
}
