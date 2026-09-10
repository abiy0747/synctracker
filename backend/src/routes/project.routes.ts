import { Router } from "express";
import {
  create,
  getProjects,
  getProject,
  update,
  remove,
} from "../controllers/project.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authenticate, create);
router.get("/", authenticate, getProjects);
router.get("/:id", authenticate, getProject);
router.put("/:id", authenticate, update);
router.delete("/:id", authenticate, remove);
export default router;