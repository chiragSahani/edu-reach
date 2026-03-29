import { Router } from "express";
import { register, login, getMe } from "../controllers/auth.controller.ts";
import authMiddleware from "../middleware/auth.middleware.ts";
import { authLimiter } from "../middleware/rate-limiter.middleware.ts";

const router = Router();

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.get("/me", authMiddleware, getMe);

export default router;