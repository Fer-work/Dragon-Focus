import mongoose from "mongoose";

const focusSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // References the User model
      required: [true, "User ID is required."],
      index: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project", // References the Project model
      required: [true, "Project ID is required for a session."],
      index: true,
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task", // References the Task model
      index: true, // Optional: A session might not always be tied to a specific task
      default: null, // Explicitly set default to null if task is optional
    },
    timestamp: {
      // When the session actually occurred/completed
      type: Date,
      required: [true, "Timestamp is required."],
      default: Date.now,
    },
    duration: {
      // Duration in minutes
      type: Number,
      required: [true, "Duration is required."],
      min: [0, "Duration cannot be negative."],
    },
    notes: {
      // Optional user notes for the session
      type: String,
      trim: true,
      maxlength: [500, "Session notes cannot exceed 500 characters."],
    },
    // The 'project' and 'task' string fields from your original model are now replaced by projectId and taskId
  },
  {
    timestamps: true, // Adds createdAt (when record is saved) and updatedAt
  }
);

const FocusSession = mongoose.model("FocusSession", focusSessionSchema);

export default FocusSession;
