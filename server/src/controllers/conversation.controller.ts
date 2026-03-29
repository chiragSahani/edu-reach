import type { Request, Response, NextFunction } from "express";
import Conversation from "../models/conversation.model.ts";

// GET /api/conversations — list user's conversations
export const getConversations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.userId;

    const conversations = await Conversation.find({ userId })
      .select("title messages updated_at created_at")
      .sort({ updated_at: -1 })
      .limit(50)
      .lean();

    const result = conversations.map((c) => ({
      id: c._id,
      title: c.title,
      messageCount: c.messages.length,
      updated_at: c.updated_at,
      created_at: c.created_at,
    }));

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

// GET /api/conversations/stats — dashboard stats
export const getStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.userId;

    const stats = await Conversation.aggregate([
      { $match: { userId: new (await import("mongoose")).Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalConversations: { $sum: 1 },
          totalMessages: { $sum: { $size: "$messages" } },
          firstChat: { $min: "$created_at" },
        },
      },
    ]);

    const result = stats[0] || { totalConversations: 0, totalMessages: 0, firstChat: null };

    res.json({
      success: true,
      data: {
        totalConversations: result.totalConversations,
        totalMessages: result.totalMessages,
        firstChat: result.firstChat,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/conversations/:id — get single conversation with messages
export const getConversation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const conversation = await Conversation.findOne({ _id: req.params.id as string, userId });

    if (!conversation) {
      res.status(404).json({ success: false, message: "Conversation not found." });
      return;
    }

    res.json({ success: true, data: conversation });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/conversations/:id
export const deleteConversation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const result = await Conversation.findOneAndDelete({ _id: req.params.id as string, userId });

    if (!result) {
      res.status(404).json({ success: false, message: "Conversation not found." });
      return;
    }

    res.json({ success: true, message: "Conversation deleted." });
  } catch (error) {
    next(error);
  }
};
