import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";
import type { BaseMessage } from "@langchain/core/messages";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let knowledgeBase = "";
let knowledgeBaseReady = false;

export const initializeKnowledgeBase = async (): Promise<void> => {
  const filePath = path.join(__dirname, "../../knowledge-base/edureach-knowledge.txt");

  if (!fs.existsSync(filePath)) {
    throw new Error(`Knowledge base file not found: ${filePath}`);
  }

  knowledgeBase = fs.readFileSync(filePath, "utf-8");

  if (!knowledgeBase.trim()) {
    throw new Error("Knowledge base file is empty");
  }

  console.log(`Knowledge base loaded (${knowledgeBase.length} characters)`);

  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set in .env!");
  }

  console.log("OpenAI API key configured — chat is ready");
  knowledgeBaseReady = true;
};

interface ChatHistory {
  role: "user" | "assistant";
  content: string;
}

export const getRAGResponse = async (
  question: string,
  history: ChatHistory[] = [],
): Promise<string> => {
  if (!knowledgeBaseReady) {
    return "The knowledge base is still initializing. Please try again in a moment, or click 'Talk to Us' to speak with a counselor.";
  }

  const systemPrompt = `You are EduReach Bot, a helpful AI counselor for EduReach College, Hyderabad.
Answer ONLY from this knowledge base. Be concise.

${knowledgeBase}

If not found, say: "I don't have that info. Contact admissions@edureach.edu.in or +91-9876543210."`;

  try {
    const model = new ChatOpenAI({
      model: "gpt-4o-mini",
      apiKey: process.env.OPENAI_API_KEY,
      temperature: 0.7,
      maxTokens: 512,
    });

    const messages: BaseMessage[] = [new SystemMessage(systemPrompt)];

    // Add conversation history (last 10 messages for context)
    const recentHistory = history.slice(-10);
    for (const msg of recentHistory) {
      if (msg.role === "user") {
        messages.push(new HumanMessage(msg.content));
      } else {
        messages.push(new AIMessage(msg.content));
      }
    }

    messages.push(new HumanMessage(question));

    const response = await model.invoke(messages);

    const content = response.content;
    if (typeof content === "string" && content.trim()) {
      return content;
    }

    return "I couldn't generate a response. Please try again.";
  } catch (error: any) {
    const msg = error?.message || "";
    console.error("Chat Error:", msg);

    if (msg.includes("429") || msg.includes("rate")) {
      return "The AI service is temporarily at capacity. Please try again in a few minutes.";
    }
    if (msg.includes("401") || msg.includes("Incorrect API key")) {
      return "AI service configuration error. Please contact support.";
    }

    return "I'm having trouble right now. Please try again or click 'Talk to Us' to speak with a counselor.";
  }
};
