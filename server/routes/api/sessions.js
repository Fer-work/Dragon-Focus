// server/routes/api/sessions.js

import { Router } from "express";
import {
  createSession,
  getSessionsForUser,
  getSessionById, // Ensure this is imported
  updateSession,
  deleteSession,
} from "../../controllers/sessionController.js";

import { protect } from "../../utils/authMiddleware.js";

const router = Router();

// Apply auth middleware to all session routes
router.use(protect);

router.route("/").get(getSessionsForUser).post(createSession);

router
  .route("/:id")
  .get(getSessionById)
  .put(updateSession)
  .delete(deleteSession);

export default router;
