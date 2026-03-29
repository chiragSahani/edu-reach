import { Router } from "express";
import { sendMessage } from "../controllers/chat.controller.ts";
import { optionalAuth } from "../middleware/auth.middleware.ts";
import { chatLimiter } from "../middleware/rate-limiter.middleware.ts";

const router = Router();
router.post("/message", chatLimiter, optionalAuth, sendMessage);

export default router;
