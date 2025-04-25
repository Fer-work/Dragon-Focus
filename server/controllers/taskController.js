import { db } from "../config/connection.js";
import { ObjectId } from "mongodb";

const taskCollection = () => db.collection("tasks");

export async function createTask(req, res) {
  try {
    const newTask = req.body;
    const result = await taskCollection().insertOne(newTask);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to create task" });
  }
}

export async function getTasks(req, res) {
  try {
    const tasks = await taskCollection().find({}).toArray();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
}

export async function updateTask(req, res) {
  try {
    const { id } = req.params;
    const updated = req.body;

    const result = await taskCollection().updateOne(
      { _id: id },
      { $set: updated }
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to update task" });
  }
}

export async function deleteTask(req, res) {
  try {
    const { id } = req.params;
    const result = await taskCollection().deleteOne({ _id: id });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to delete task" });
  }
}
