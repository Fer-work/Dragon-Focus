// server/routes/api/index.js

import { Router } from "express";
import userRoutes from "./users.js";
import taskRoutes from "./tasks.js";
import sessionRoutes from "./sessions.js";
import categoryRoutes from "./categories.js";

const router = Router();

router.use("/users", userRoutes);
router.use("/tasks", taskRoutes);
router.use("/sessions", sessionRoutes);
router.use("/categories", categoryRoutes);

export default router;
