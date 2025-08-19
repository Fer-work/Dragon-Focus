// server/models/User.js

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: [true, "Firebase UID is required."],
      unique: true,
      index: true, // Important for quick lookups
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/.+@.+\..+/, "Please fill a valid email address."],
    },
    username: {
      // Optional: if you want users to have a display name separate from email
      type: String,
      required: [true, "Username is required."],
      trim: true,
      sparse: true, // Allows multiple nulls, but if a value exists, it must be unique
      unique: true, // If you want usernames to be unique
      minlength: [3, "Username must be at least 3 characters long."],
    },
    focusGems: {
      // For in-app currency
      type: Number,
      default: 0,
      min: [0, "Focus Gems cannot be negative."],
    },
    preferences: {
      // For user-specific settings
      defaultPomodoroTime: { type: Number, default: 25 }, // in minutes
      defaultShortBreakTime: { type: Number, default: 5 }, // in minutes
      defaultLongBreakTime: { type: Number, default: 15 }, // in minutes
      defaultLongBreakInterval: {
        type: Number,
        default: 4,
      },
      theme: { type: String, default: "default" },
    },
    // Example for Phase 2: tracking unlocked guardians
    // unlockedGuardians: [{
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'FocusGuardian'
    // }],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

const User = mongoose.model("User", userSchema);

export default User;
