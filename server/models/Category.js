import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // References the User model
      required: [true, "User ID is required for a category."],
      index: true,
    },
    name: {
      type: String,
      required: [true, "Category name is required."],
      trim: true,
      minlength: [1, "Category name cannot be empty."],
      maxlength: [100, "Category name cannot exceed 100 characters."],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Category description cannot exceed 500 characters."],
    },
    status: {
      type: String,
      enum: {
        values: ["active", "on-hold", "completed", "archived"],
        message: "{VALUE} is not a supported Category status.",
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

const Category = mongoose.model("Category", categorySchema);

export default Category;
