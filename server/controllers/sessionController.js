import FocusSession from "../models/FocusSession.js";
import Project from "../models/Project.js"; // Needed for default project logic
import Task from "../models/Task.js"; // Potentially for default task logic

// @desc    Create a new Focus Session
// @route   POST /api/sessions
// @access  Private (requires authentication)
export async function createSession(req, res) {
  try {
    const {
      timestamp,
      duration,
      projectId, // Expecting ObjectId from the client
      taskId, // Expecting ObjectId from the client (optional)
      notes, // Optional notes for the session
    } = req.body;

    const userId = req.user._id; // From authMiddleware

    // --- Default Project/Task Handling ---
    // This is a placeholder for more robust default handling.
    // For a true MVP, the client should ideally send a valid projectId.
    // If projectId is not sent, we might assign to a default "General" project for the user.
    let actualProjectId = projectId;
    let actualTaskId = taskId;

    if (!actualProjectId) {
      // Attempt to find or create a default project for the user
      let defaultProject = await Project.findOne({
        userId,
        name: "General Focus",
      });
      if (!defaultProject) {
        defaultProject = await Project.create({
          userId,
          name: "General Focus",
          description:
            "Default project for sessions without a specific project.",
        });
      }
      actualProjectId = defaultProject._id;

      // If there's no project, there's likely no specific task.
      // If a default project is used, a default task within it could also be considered.
      // For simplicity, if no projectId is provided, taskId is also considered null/default.
      if (!taskId) {
        let defaultTask = await Task.findOne({
          projectId: actualProjectId,
          name: "General Task",
        });
        if (!defaultTask) {
          defaultTask = await Task.create({
            projectId: actualProjectId,
            userId, // Denormalized userId on Task model
            name: "General Task",
            description: "Default task for general focus sessions.",
          });
        }
        actualTaskId = defaultTask._id;
      }
    }
    // --- End Default Project/Task Handling ---

    // Validate required fields that are now ObjectIds
    if (!actualProjectId) {
      return res.status(400).json({ message: "Project ID is required." });
    }
    if (!duration) {
      return res.status(400).json({ message: "Duration is required." });
    }

    const newSession = new FocusSession({
      userId,
      projectId: actualProjectId,
      taskId: actualTaskId, // Will be null if not provided and no default task logic hits
      timestamp: timestamp || new Date(), // Default to now if not provided
      duration, // in minutes
      notes,
    });

    const savedSession = await newSession.save();

    // Optional: Populate referenced fields if you want to return more detailed info
    const populatedSession = await FocusSession.findById(savedSession._id)
      .populate("projectId", "name color") // Populate project name and color
      .populate("taskId", "name"); // Populate task name

    res.status(201).json({
      message: "Focus session saved successfully!",
      session: populatedSession || savedSession, // Send populated if successful
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
  try {
    const userId = req.user._id; // From authMiddleware

    // Optional: Add filtering via query parameters, e.g., /api/sessions?projectId=someId
    const queryFilters = { userId };
    if (req.query.projectId) {
      queryFilters.projectId = req.query.projectId;
    }
    // Add more filters as needed (e.g., date range)

    // TODO: Investigate 'populate'
    const sessions = await FocusSession.find(queryFilters)
      .populate("projectId", "name color") // Populate project name and color
      .populate("taskId", "name") // Populate task name
      .sort({ timestamp: -1 }); // Sort by most recent first

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
  try {
    const userId = req.user._id;
    const sessionId = req.params.id;

    const session = await FocusSession.findOne({ _id: sessionId, userId })
      .populate("projectId", "name color")
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
  try {
    const userId = req.user._id;
    const sessionId = req.params.id;
    const { timestamp, duration, projectId, taskId, notes } = req.body;

    // Ensure the session exists and belongs to the user
    let session = await FocusSession.findOne({ _id: sessionId, userId });

    if (!session) {
      return res
        .status(404)
        .json({ message: "Focus session not found or not authorized." });
    }

    // Update fields
    if (timestamp) session.timestamp = timestamp;
    if (duration) session.duration = duration;
    if (projectId) session.projectId = projectId;
    if (taskId !== undefined) session.taskId = taskId; // Allow setting task to null
    if (notes !== undefined) session.notes = notes;

    const updatedSession = await session.save();

    const populatedSession = await FocusSession.findById(updatedSession._id)
      .populate("projectId", "name color")
      .populate("taskId", "name");

    res.status(200).json({
      message: "Focus session updated successfully!",
      session: populatedSession || updatedSession,
    });
  } catch (error) {
    console.error("Error updating session:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res
        .status(400)
        .json({ message: "Validation Error", errors: messages });
    }
    if (error.name === "CastError") {
      // For invalid ObjectId in projectId or taskId
      return res
        .status(400)
        .json({ message: "Invalid ID format for project or task." });
    }
    res.status(500).json({ message: "Failed to update session." });
  }
}

// @desc    Delete a Focus Session
// @route   DELETE /api/sessions/:id
// @access  Private
export async function deleteSession(req, res) {
  try {
    const userId = req.user._id;
    const sessionId = req.params.id;

    const session = await FocusSession.findOneAndDelete({
      _id: sessionId,
      userId,
    });

    if (!session) {
      return res
        .status(404)
        .json({ message: "Focus session not found or not authorized." });
    }

    res.status(200).json({ message: "Focus session deleted successfully." });
  } catch (error) {
    console.error("Error deleting session:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid session ID format." });
    }
    res.status(500).json({ message: "Failed to delete session." });
  }
}
