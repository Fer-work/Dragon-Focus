import { Router } from "express";
import path from "path";
import apiRoutes from "./api/index.js";

const router = Router();

router.use("/api", apiRoutes);

router.use((req, res) => {
  res.sendFile(path.join(process.cwd(), "client", "build", "index.html"));
});

export default router;
