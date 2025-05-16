import { Router } from "express";
import path from "path";
import apiRoutes from "./api/index.js";

const router = Router();

router.use("/api", apiRoutes);

// This serves your React app's index.html for any non-API GET requests
// It's the client-side routing catch-all for your SPA
router.use((req, res) => {
  // Assuming your client build output is in project_root/client/build
  res.sendFile(path.join(process.cwd(), "client", "build", "index.html"));
});

export default router;
