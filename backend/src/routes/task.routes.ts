import { Router } from "express";
import {
  create,
  getTasks,
} from "../controllers/task.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authenticate, create);
router.get("/", authenticate, getTasks);

export default router;