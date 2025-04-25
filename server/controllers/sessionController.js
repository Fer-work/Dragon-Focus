import { db } from "../config/connection.js";
import { ObjectId } from "mongodb";

// Create a new Pomodoro session
export async function createSession(req, res) {
  try {
    const newSession = req.body;
    const result = await db.collection("sessions").insertOne(newSession);
    res.status(201).json(result);
  } catch (err) {
    console.error("Create Session Error:", err);
    res.status(500).json({ error: "Failed to create session" });
  }
}

// Get all sessions (optionally, filter by userId if you add Firebase auth later)
export async function getSessions(req, res) {
  try {
    const sessions = await db.collection("sessions").find().toArray();
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

    const result = await db
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

    const result = await db.collection("sessions").deleteOne({
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
