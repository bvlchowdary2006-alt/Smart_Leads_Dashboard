import jwt, { type SignOptions } from "jsonwebtoken";
import config from "../config/env";
import type { JwtPayload } from "../types";

const accessOptions: SignOptions = {
  expiresIn: config.jwt.accessExpiry,
};

const refreshOptions: SignOptions = {
  expiresIn: config.jwt.refreshExpiry,
};

export const generateAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, config.jwt.accessSecret, accessOptions);
};

export const generateRefreshToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, config.jwt.refreshSecret, refreshOptions);
};

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.jwt.accessSecret) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.jwt.refreshSecret) as JwtPayload;
};
