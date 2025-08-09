// server/routes/index.js

import { Router } from "express";
import path from "path";
import apiRoutes from "./api/index.js";

const router = Router();

router.use("/api", apiRoutes);

export default router;
