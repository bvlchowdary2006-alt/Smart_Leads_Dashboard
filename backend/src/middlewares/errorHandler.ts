import type { Request, Response, NextFunction } from "express";
import type { ApiError } from "../types";

export const errorHandler = (
  err: Error | ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = (err as ApiError).statusCode || 500;
  const message = err.message || "Internal Server Error";
  const stack = process.env.NODE_ENV === "development" ? err.stack : undefined;

  res.status(statusCode).json({
    success: false,
    message,
    errors: (err as ApiError).errors,
    stack,
  });
};
