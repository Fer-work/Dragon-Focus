import User from "../models/User.js"; // Path to your User model
import admin from "firebase-admin";

// @desc    Create a new user profile if one doesn't exist
// @route   POST /api/users
// @access  Private (Middleware attaches firebaseUser and user if found)
export async function createUser(req, res) {
  // 1. If req.user exists, the user is already in our DB.
  if (req.user) {
    return res
      .status(200)
      .json({ message: "User already exists.", user: req.user });
  }

  // 2. If no req.user, create one using the verified req.firebaseUser
  try {
    const { uid, email } = req.firebaseUser;
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ message: "Username is required." });
    }

    const newUser = new User({
      firebaseUid: uid,
      email,
      username,
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      message: "User profile created successfully!",
      user: savedUser,
    });
  } catch (error) {
    console.error("Error creating user:", error);

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      const message = `An account with that ${field} already exists.`;
      return res.status(409).json({ message });
    }

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res
        .status(400)
        .json({ message: "Validation Error", errors: messages });
    }

    res
      .status(500)
      .json({ message: "Failed to create user profile on the server." });
  }
}

// @desc    Update current authenticated user's profile
// @route   PUT /api/users/me
// @access  Private
export async function updateCurrentUser(req, res) {
  // 1. Authorization Check
  if (!req.user) {
    return res.status(401).json({ message: "User not found in database." });
  }

  try {
    const { username, preferences } = req.body;

    // We can update the user directly from req.user
    const user = req.user;

    if (username !== undefined) {
      user.username = username;
    }

    // Explicitly map incoming preference keys to the schema's field names
    if (preferences) {
      const preferencesToUpdate = {};
      if (preferences.defaultPomodoroTime !== undefined) {
        preferencesToUpdate.defaultPomodoroTime =
          preferences.defaultPomodoroTime;
      }
      if (preferences.defaultShortBreakTime !== undefined) {
        preferencesToUpdate.defaultShortBreakTime =
          preferences.defaultShortBreakTime;
      }
      if (preferences.defaultLongBreakTime !== undefined) {
        preferencesToUpdate.defaultLongBreakTime =
          preferences.defaultLongBreakTime;
      }
      if (preferences.defaultLongBreakInterval !== undefined) {
        preferencesToUpdate.defaultLongBreakInterval =
          preferences.defaultLongBreakInterval;
      }
      user.preferences = { ...user.preferences, ...preferencesToUpdate };
    }

    const updatedUser = await user.save();

    res.status(200).json({
      message: "User profile updated successfully!",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res
        .status(400)
        .json({ message: "Validation Error", errors: messages });
    }
    if (error.code === 11000 && error.keyPattern && error.keyPattern.username) {
      return res
        .status(409)
        .json({ message: "This username is already taken." });
    }
    res.status(500).json({ message: "Failed to update user profile." });
  }
}

// @desc    Delete current authenticated user's account and all associated data
// @route   DELETE /api/users/me
// @access  Private
export async function deleteCurrentUser(req, res) {
  if (!req.user) {
    return res.status(401).json({ message: "User not found in database." });
  }

  try {
    const { _id: userId, firebaseUid } = req.user;

    // 1. Delete all associated data in parallel for efficiency
    await Promise.all([
      FocusSession.deleteMany({ userId }),
      Task.deleteMany({ userId }),
      Category.deleteMany({ userId }),
    ]);

    // 2. Delete the user from MongoDB
    await User.findByIdAndDelete(userId);

    // 3. Delete the user from Firebase Authentication
    await admin.auth().deleteUser(firebaseUid);

    res
      .status(200)
      .json({
        message: "User account and all associated data have been deleted.",
      });
  } catch (error) {
    console.error("Error deleting user account:", error);
    res.status(500).json({ message: "Failed to delete user account." });
  }
}
