import { Router } from "express";
import {
  create,
  getTasks,
  getTask,
  update,
} from "../controllers/task.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authenticate, create);
router.get("/", authenticate, getTasks);
router.get("/:id", authenticate, getTask);
router.put("/:id", authenticate, update);
export default router;