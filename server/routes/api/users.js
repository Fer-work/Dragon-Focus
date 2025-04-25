import { Router } from "express";

import { createUser, getUserByUid } from "../../controllers/userController.js";

const router = Router();

router.route("/").post(createUser);
router.route("/:uid").get(getUserByUid);

export default router;
