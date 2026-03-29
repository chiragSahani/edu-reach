import type { Request, Response, NextFunction } from "express";

const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction): void => {
  console.error("Error:", err.message || err);

  const isDev = process.env.NODE_ENV !== "production";

  // Mongoose validation error
  if (err.name === "ValidationError" && err.errors) {
    const messages = Object.values(err.errors).map((e: any) => e.message);
    res.status(400).json({ success: false, message: messages.join(", ") });
    return;
  }

  // MongoDB duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || "field";
    res.status(409).json({ success: false, message: `A record with this ${field} already exists.` });
    return;
  }

  // MongoDB CastError (invalid ObjectId)
  if (err.name === "CastError") {
    res.status(400).json({ success: false, message: "Invalid ID format." });
    return;
  }

  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: isDev ? err.message : "Internal server error.",
  });
};

export default errorHandler;
