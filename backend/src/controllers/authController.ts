import type { Request, Response } from "express";
import * as authService from "../services/authService";
import { createApiResponse, asyncHandler, AppError } from "../utils/helpers";
import type { RegisterInput, LoginInput } from "../validators/auth";
import config from "../config/env";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as RegisterInput;
  const result = await authService.registerUser(input);

  res.cookie("refreshToken", result.tokens.refreshToken, {
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json(
    createApiResponse(true, "User registered successfully.", {
      user: result.user,
      accessToken: result.tokens.accessToken,
    })
  );
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as LoginInput;
  const result = await authService.loginUser(input);

  res.cookie("refreshToken", result.tokens.refreshToken, {
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json(
    createApiResponse(true, "Login successful.", {
      user: result.user,
      accessToken: result.tokens.accessToken,
    })
  );
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Authentication required.", 401);
  }

  await authService.logoutUser(req.user.id);

  res.clearCookie("refreshToken");
  res.status(200).json(createApiResponse(true, "Logout successful."));
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Authentication required.", 401);
  }

  const user = await authService.getCurrentUser(req.user.id);
  res.status(200).json(createApiResponse(true, "User fetched successfully.", user));
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    throw new AppError("Refresh token not found.", 401);
  }

  const tokens = await authService.refreshUserToken(token);

  res.cookie("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json(
    createApiResponse(true, "Token refreshed successfully.", {
      accessToken: tokens.accessToken,
    })
  );
});
