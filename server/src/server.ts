import app from "./app.ts";
import connectDB from "./config/db.config.ts";
import { initializeKnowledgeBase } from "./services/rag.service.ts";

const PORT = process.env.PORT || 5000;

const start = async (): Promise<void> => {
  try {
    await connectDB();
  } catch (error) {
    console.error("Failed to connect to database:", error);
    process.exit(1);
  }

  try {
    await initializeKnowledgeBase();
  } catch (error) {
    console.error("Knowledge base initialization failed (chat will be degraded):", error);
  }

  app.listen(PORT, () => {
    console.log("EduReach Server is running!");
    console.log(`URL: http://localhost:${PORT}`);
    console.log(`Node: ${process.version}`);
    console.log("Press Ctrl+C to stop");
  });
};

start();