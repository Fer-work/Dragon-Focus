import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project", // References the Project model
      required: [true, "Project ID is required for a task."],
      index: true,
    },
    userId: {
      // Denormalized for easier querying, ensuring task owner matches project owner
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // References the User model
      required: [true, "User ID is required for a task."],
      index: true,
    },
    name: {
      type: String,
      required: [true, "Task name is required."],
      trim: true,
      minlength: [1, "Task name cannot be empty."],
      maxlength: [200, "Task name cannot exceed 200 characters."],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Task description cannot exceed 1000 characters."],
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "in-progress", "completed", "blocked"],
        message: "{VALUE} is not a supported task status.",
      },
      default: "pending",
    },
    dueDate: {
      type: Date,
    },
    estimatedPomodoros: {
      // User's estimate of Pomodoros needed
      type: Number,
      min: [0, "Estimated Pomodoros cannot be negative."],
      default: 0,
    },
    actualPomodoros: {
      // Count of completed Pomodoros for this task
      type: Number,
      min: [0, "Actual Pomodoros cannot be negative."],
      default: 0,
    },
    // You could add `priority: { type: String, enum: ['low', 'medium', 'high'] }`
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Optional: Compound index if you often query tasks by user and project
// taskSchema.index({ userId: 1, projectId: 1 });

const Task = mongoose.model("Task", taskSchema);

export default Task;
