import { Router } from "express";
import { getConversations, getStats, getConversation, deleteConversation } from "../controllers/conversation.controller.ts";
import authMiddleware from "../middleware/auth.middleware.ts";

const router = Router();

router.use(authMiddleware);

router.get("/stats", getStats);
router.get("/", getConversations);
router.get("/:id", getConversation);
router.delete("/:id", deleteConversation);

export default router;
