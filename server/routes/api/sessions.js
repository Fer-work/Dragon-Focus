import { Router } from "express";
import {
  createSession,
  getSessions,
  updateSession,
  deleteSession,
} from "../../controllers/sessionController.js";

const router = Router();

router.route("/").get(getSessions).post(createSession);

router.route("/:id").put(updateSession).delete(deleteSession);

export default router;
