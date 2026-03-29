import type { Request, Response, NextFunction } from "express";
import { getRAGResponse } from "../services/rag.service.ts";
import Conversation from "../models/conversation.model.ts";

// POST /api/chat/message
export const sendMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { message, conversationId } = req.body;
    if (!message || typeof message !== "string" || !message.trim()) {
      res.status(400).json({ success: false, message: "Message is required." });
      return;
    }

    const currentUser = (req as any).user;
    const trimmedMessage = message.trim();

    // Load history if conversation exists
    let history: { role: "user" | "assistant"; content: string }[] = [];
    let conversation = null;

    if (conversationId && currentUser) {
      conversation = await Conversation.findOne({ _id: conversationId, userId: currentUser.userId });
      if (conversation) {
        history = conversation.messages.map((m) => ({ role: m.role, content: m.content }));
      }
    }

    const answer = await getRAGResponse(trimmedMessage, history);

    // Persist if user is authenticated
    if (currentUser) {
      if (conversation) {
        conversation.messages.push(
          { role: "user", content: trimmedMessage, timestamp: new Date() },
          { role: "assistant", content: answer, timestamp: new Date() },
        );
        conversation.updated_at = new Date();
        await conversation.save();
      } else {
        conversation = await Conversation.create({
          userId: currentUser.userId,
          title: trimmedMessage.slice(0, 60),
          messages: [
            { role: "user", content: trimmedMessage, timestamp: new Date() },
            { role: "assistant", content: answer, timestamp: new Date() },
          ],
        });
      }
    }

    res.json({
      success: true,
      data: {
        message: answer,
        conversationId: conversation?._id?.toString() || null,
      },
    });
  } catch (error) {
    next(error);
  }
};
