import { db } from "../config/connection.js";

const userCollection = () => db.collection("users");

export async function createUser(req, res) {
  try {
    const { uid, email } = req.body;
    const result = await userCollection().insertOne({ uid, email });
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to create user" });
  }
}

export async function getUserByUid(req, res) {
  try {
    const { uid } = req.params;
    const user = await userCollection().findOne({ uid });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
}
