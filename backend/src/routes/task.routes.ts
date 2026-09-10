import { Router } from "express";
import {
  create,
  getTasks,
  getTask,
} from "../controllers/task.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authenticate, create);
router.get("/", authenticate, getTasks);
router.get("/:id", authenticate, getTask);

export default router;