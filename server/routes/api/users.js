import { Router } from "express";
import {
  createUser,
  getCurrentUser,
  updateCurrentUser,
  // deleteCurrentUser, // Optional: if you want to allow account deletion
} from "../../controllers/userController.js";
import { protect } from "../../utils/authMiddleware.js"; // Example: Your auth middleware

const router = Router();

// Route to create a new user or sync Firebase user data
// This might be called after Firebase authentication on the client
// to ensure a user profile exists in your MongoDB.
// If it's part of a login flow, it might be protected or have specific logic.
router.post("/", createUser);

// Routes for the authenticated user to manage their own profile
// These routes would typically be protected by authentication middleware
router
  .route("/me")
  .all(protect)
  .get(getCurrentUser) // Get the profile of the currently authenticated user
  .put(updateCurrentUser); // Update the profile of the currently authenticated user
// .delete(deleteCurrentUser);

// If you still need a specific admin route to get any user by UID:
// router.get("/:firebaseUid", protect, someAdminController.getUserByFirebaseUid);

export default router;
