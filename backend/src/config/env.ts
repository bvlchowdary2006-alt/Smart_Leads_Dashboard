import dotenv from "dotenv";

dotenv.config();

const config = {
  port: parseInt(process.env.PORT || "5000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/smart-leads",
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || "access-secret-change-in-production",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "refresh-secret-change-in-production",
    accessExpiry: process.env.JWT_ACCESS_EXPIRY || "15m",
    refreshExpiry: process.env.JWT_REFRESH_EXPIRY || "7d",
  },
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10),
    max: parseInt(process.env.RATE_LIMIT_MAX || "100", 10),
  },
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || "12", 10),
};

export default config;
