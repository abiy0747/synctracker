import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  register,
  login,
  getMe,
} from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
});

router.post("/register", register);
router.post("/login", loginLimiter, login);
router.get("/me", authenticate, getMe);

export default router;