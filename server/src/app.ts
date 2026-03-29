import express from "express";
import type { Application, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import authRoutes from "./routes/auth.routes.ts";
import chatRoutes from "./routes/chat.routes.ts";
import vapiRoutes from "./routes/vapi.routes.ts";
import conversationRoutes from "./routes/conversation.routes.ts";
import errorHandler from "./middleware/error-handler.middleware.ts";
import { generalLimiter } from "./middleware/rate-limiter.middleware.ts";

const app: Application = express();

// Security headers
app.use(helmet());

// Compression
app.use(compression());

// Logging
const isDev = (process.env.NODE_ENV || "development") === "development";
app.use(morgan(isDev ? "dev" : "combined"));

// CORS
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:4173",
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin || allowedOrigins.some((o) => origin.startsWith(o))) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Global rate limit
app.use(generalLimiter);

// Health check
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ success: true, message: "Server is running.", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/vapi", vapiRoutes);
app.use("/api/conversations", conversationRoutes);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: "Route not found." });
});

// Error handler
app.use(errorHandler);

export default app;
