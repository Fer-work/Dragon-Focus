import { Router } from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../../controllers/taskController.js";

const router = Router();

router.route("/").get(getTasks).post(createTask);

router.route("/:id").put(updateTask).delete(deleteTask);

export default router;
