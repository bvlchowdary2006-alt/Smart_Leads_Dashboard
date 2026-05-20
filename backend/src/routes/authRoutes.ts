import { Router } from "express";
import * as authController from "../controllers/authController";
import { validate } from "../middlewares/validate";
import { registerSchema, loginSchema } from "../validators/auth";
import { authenticate } from "../middlewares/auth";
import { authLimiter } from "../middlewares/rateLimiter";

const router = Router();

router.post("/register", authLimiter, validate(registerSchema), authController.register);
router.post("/login", authLimiter, validate(loginSchema), authController.login);
router.post("/logout", authenticate, authController.logout);
router.get("/me", authenticate, authController.getMe);
router.post("/refresh-token", authController.refreshToken);

export default router;
