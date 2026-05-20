import express, { type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import config from "./config/env";
import connectDatabase from "./config/database";
import { errorHandler } from "./middlewares/errorHandler";
import { apiLimiter } from "./middlewares/rateLimiter";
import authRoutes from "./routes/authRoutes";
import leadRoutes from "./routes/leadRoutes";
import { createApiResponse, AppError } from "./utils/helpers";

const app = express();

// Security middleware
app.use(helmet());
app.use(cors(config.cors));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate limiting
app.use("/api", apiLimiter);

// Health check
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json(createApiResponse(true, "Server is healthy."));
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);

// 404 handler
app.use((_req: Request, _res: Response, next) => {
  next(new AppError("Route not found.", 404));
});

// Error handler
app.use(errorHandler);

// Start server
const startServer = async (): Promise<void> => {
  await connectDatabase();

  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port} in ${config.nodeEnv} mode`);
  });
};

startServer();

export default app;
