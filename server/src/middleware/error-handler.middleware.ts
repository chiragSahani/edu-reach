import type { Request, Response, NextFunction } from "express";

const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
  console.error("Error:", err.message);

  const isDev = process.env.NODE_ENV !== "production";

  res.status(500).json({
    success: false,
    message: isDev ? err.message : "Internal server error.",
  });
};

export default errorHandler;