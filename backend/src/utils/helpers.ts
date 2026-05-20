import type { Request, Response, NextFunction } from "express";

type AsyncController = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export const asyncHandler =
  (controller: AsyncController): AsyncController =>
  async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      next(error);
    }
  };

export const createApiResponse = <T>(
  success: boolean,
  message: string,
  data?: T,
  meta?: Record<string, unknown>
): { success: boolean; message: string; data?: T; meta?: Record<string, unknown> } => ({
  success,
  message,
  data,
  meta: meta ? (meta as Record<string, unknown>) : undefined,
});

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
