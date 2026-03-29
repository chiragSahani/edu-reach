import { Router } from "express";
import { sendMessage } from "../controllers/chat.controller.ts";
import { chatLimiter } from "../middleware/rate-limiter.middleware.ts";

const router = Router();
router.post("/message", chatLimiter, sendMessage);

export default router;
