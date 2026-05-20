import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";
import { AppError } from "../utils/helpers";

export const validate = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof Error && "errors" in error) {
        const zodErrors = error.errors as Array<{ path: string[]; message: string }>;
        const formattedErrors: Record<string, string[]> = {};

        zodErrors.forEach((err) => {
          const field = err.path[0]?.toString() || "unknown";
          if (!formattedErrors[field]) {
            formattedErrors[field] = [];
          }
          formattedErrors[field].push(err.message);
        });

        throw new AppError("Validation failed", 400);
      }
      next(error);
    }
  };
};
