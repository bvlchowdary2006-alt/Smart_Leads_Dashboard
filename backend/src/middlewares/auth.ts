import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/tokens";
import User from "../models/User";
import { AppError, asyncHandler } from "../utils/helpers";
import type { JwtPayload, UserRole } from "../types";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: UserRole;
      };
    }
  }
}

export const authenticate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new AppError("Authentication required. No token provided.", 401);
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = verifyAccessToken(token) as JwtPayload;

      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        throw new AppError("User not found.", 401);
      }

      req.user = {
        id: user._id.toString(),
        email: user.email,
        role: user.role as UserRole,
      };

      next();
    } catch (error) {
      if (error instanceof Error && error.name === "TokenExpiredError") {
        throw new AppError("Token expired. Please login again.", 401);
      }
      throw new AppError("Invalid token.", 401);
    }
  }
);

export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError("Authentication required.", 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError("You do not have permission to perform this action.", 403);
    }

    next();
  };
};
