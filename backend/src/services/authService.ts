import User from "../models/User";
import { AppError } from "../utils/helpers";
import type { RegisterInput, LoginInput } from "../validators/auth";
import type { TokenPair, JwtPayload } from "../types";
import { verifyRefreshToken, generateAccessToken, generateRefreshToken } from "../utils/tokens";

export const registerUser = async (
  input: RegisterInput
): Promise<{ user: { id: string; name: string; email: string; role: string }; tokens: TokenPair }> => {
  const existingUser = await User.findOne({ email: input.email });
  if (existingUser) {
    throw new AppError("User with this email already exists.", 409);
  }

  const user = await User.create({
    name: input.name,
    email: input.email,
    password: input.password,
    role: input.role || "sales",
  });

  const tokens = user.generateTokens();
  user.refreshToken = tokens.refreshToken;
  await user.save();

  return {
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    },
    tokens,
  };
};

export const loginUser = async (
  input: LoginInput
): Promise<{ user: { id: string; name: string; email: string; role: string }; tokens: TokenPair }> => {
  const user = await User.findOne({ email: input.email }).select("+password");
  if (!user) {
    throw new AppError("Invalid email or password.", 401);
  }

  const isPasswordValid = await user.comparePassword(input.password);
  if (!isPasswordValid) {
    throw new AppError("Invalid email or password.", 401);
  }

  const tokens = user.generateTokens();
  user.refreshToken = tokens.refreshToken;
  await user.save();

  return {
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    },
    tokens,
  };
};

export const logoutUser = async (userId: string): Promise<void> => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
};

export const getCurrentUser = async (userId: string) => {
  const user = await User.findById(userId).select("-password -refreshToken");
  if (!user) {
    throw new AppError("User not found.", 404);
  }
  return user;
};

export const refreshUserToken = async (
  refreshToken: string
): Promise<{ accessToken: string; refreshToken: string }> => {
  if (!refreshToken) {
    throw new AppError("Refresh token is required.", 401);
  }

  const decoded = verifyRefreshToken(refreshToken) as JwtPayload;

  const user = await User.findById(decoded.id).select("+refreshToken");
  if (!user) {
    throw new AppError("User not found.", 401);
  }

  if (user.refreshToken !== refreshToken) {
    throw new AppError("Invalid refresh token.", 401);
  }

  const newAccessToken = generateAccessToken(decoded);
  const newRefreshToken = generateRefreshToken(decoded);

  user.refreshToken = newRefreshToken;
  await user.save();

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};
