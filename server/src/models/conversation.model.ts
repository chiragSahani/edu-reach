import mongoose, { Schema } from "mongoose";
import type { Document, Types } from "mongoose";

export interface IMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface IConversation extends Document {
  userId: Types.ObjectId;
  title: string;
  messages: IMessage[];
  created_at: Date;
  updated_at: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false },
);

const ConversationSchema = new Schema<IConversation>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  title: { type: String, required: true, maxlength: 80 },
  messages: { type: [MessageSchema], default: [] },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

ConversationSchema.index({ userId: 1, updated_at: -1 });

const Conversation = mongoose.model<IConversation>("Conversation", ConversationSchema);
export default Conversation;
