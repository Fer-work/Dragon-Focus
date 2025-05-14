import connectToDatabase from "../config/connection.js";
import FocusSession from "../../models/focusSession.js";
import { ObjectId } from "mongodb";

// Create a new Pomodoro session
export async function createSession(req, res) {
  try {
    const { timestamp, duration, project, task, userId } = req.body;
    const newSession = new FocusSession({
      userId, // This should ideally come from a verified token on the backend
      timestamp,
      duration,
      project,
      task,
    });
    const savedSession = await newSession.save();
    res
      .status(201)
      .json({ message: "Session saved successfully!", session: savedSession });
  } catch (err) {
    console.error("Error saving session:", err);
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation Error", errors: error.errors });
    }
    res.status(500).json({ message: "Failed to save session on the server." });
  }
}

// Get all sessions (optionally, filter by userId if you add Firebase auth later)
export async function getSessions(req, res) {
  try {
    const sessions = await connectToDatabase
      .collection("sessions")
      .find()
      .toArray();
    res.status(200).json(sessions);
  } catch (err) {
    console.error("Get Sessions Error:", err);
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
}

// Update a specific session by ID
export async function updateSession(req, res) {
  try {
    const sessionId = req.params.id;
    const update = req.body;

    const result = await connectToDatabase
      .collection("sessions")
      .updateOne({ _id: new ObjectId(sessionId) }, { $set: update });

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Session not found" });
    }

    res.status(200).json({ message: "Session updated" });
  } catch (err) {
    console.error("Update Session Error:", err);
    res.status(500).json({ error: "Failed to update session" });
  }
}

// Delete a specific session by ID
export async function deleteSession(req, res) {
  try {
    const sessionId = req.params.id;

    const result = await connectToDatabase.collection("sessions").deleteOne({
      _id: new ObjectId(sessionId),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Session not found" });
    }

    res.status(200).json({ message: "Session deleted" });
  } catch (err) {
    console.error("Delete Session Error:", err);
    res.status(500).json({ error: "Failed to delete session" });
  }
}
