import { Router } from "express";
import path from "path";
import apiRoutes from "./api/index.js";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

router.use("/api", apiRoutes);

router.use((req, res) => {
  res.sendFile(path.join(process.cwd(), "client", "build", "index.html"));
});

export default router;
