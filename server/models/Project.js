import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // References the User model
      required: [true, "User ID is required for a project."],
      index: true,
    },
    name: {
      type: String,
      required: [true, "Project name is required."],
      trim: true,
      minlength: [1, "Project name cannot be empty."],
      maxlength: [100, "Project name cannot exceed 100 characters."],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Project description cannot exceed 500 characters."],
    },
    status: {
      type: String,
      enum: {
        values: ["active", "on-hold", "completed", "archived"],
        message: "{VALUE} is not a supported project status.",
      },
      default: "active",
    },
    color: {
      // Optional: for UI visual distinction, e.g., hex color code
      type: String,
      trim: true,
      match: [
        /^#([0-9a-fA-F]{3}){1,2}$|^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$|^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*(0(\.\d+)?|1(\.0)?)\s*\)$|^hsl\(\s*\d+\s*,\s*\d+%?\s*,\s*\d+%?\s*\)$|^hsla\(\s*\d+\s*,\s*\d+%?\s*,\s*\d+%?\s*,\s*(0(\.\d+)?|1(\.0)?)\s*\)$/,
        "Invalid color format.",
      ], // Basic regex for hex, rgb(a), hsl(a)
    },
    // You could add more fields like `deadline: Date` if needed
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
