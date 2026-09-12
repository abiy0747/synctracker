import { Router } from "express";
import {
  create,
  getProjects,
  getProject,
  update,
  remove,
  addMember,
  updateMember,
  getMembers,
  removeMember,
} from "../controllers/project.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireProjectRole } from "../middleware/project.middleware";

const router = Router();

router.post("/", authenticate, create);
router.get("/", authenticate, getProjects);
router.get("/:id", authenticate, getProject);
router.put("/:id", authenticate, update);
router.delete("/:id", authenticate, remove);
router.post(
  "/:id/members",
  authenticate,
  requireProjectRole(["OWNER"]),
  addMember
);
router.patch("/:id/members/:memberId", authenticate, updateMember);
router.get("/:id/members", authenticate, getMembers);
router.delete("/:id/members/:userId", authenticate, removeMember);
export default router;