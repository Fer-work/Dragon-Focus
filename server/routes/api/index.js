import { Router } from "express";
import userRoutes from "./users.js";
import taskRoutes from "./tasks.js";
import sessionRoutes from "./sessions.js";

const router = Router();

router.use("/users", userRoutes);
router.use("/tasks", taskRoutes);
router.use("/sessions", sessionRoutes);

export default router;
