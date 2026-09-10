import { Router } from "express";
import { create } from "../controllers/task.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authenticate, create);

export default router;