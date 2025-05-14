import mongoose from "mongoose";

const focusSessionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, "User ID is required."],
    index: true,
  },
  timestamp: {
    type: Date,
    required: [true, "Timestamp is required."],
    default: Date.now,
  },
  duration: {
    type: Number,
    required: [true, "Duration is required."],
    min: [0, "Duration cannot be negative."],
  },
  project: {
    type: String,
    required: [true, "Project name is required."],
    trim: true,
    default: "Unamed Project",
  },
  task: {
    type: String,
    trim: true,
    default: "Other",
  },
});

const FocusSession = mongoose.model("FocusSession", focusSessionSchema);

export default FocusSession;
