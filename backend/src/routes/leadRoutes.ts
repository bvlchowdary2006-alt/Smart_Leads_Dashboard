import { Router } from "express";
import * as leadController from "../controllers/leadController";
import { validate } from "../middlewares/validate";
import { createLeadSchema, updateLeadSchema } from "../validators/lead";
import { authenticate, authorize } from "../middlewares/auth";
import { USER_ROLES } from "../constants";

const router = Router();

router.use(authenticate);

// Specific routes first (before parameterized routes)
router.get("/", leadController.getLeads);
router.get("/export/csv", leadController.exportCsv);
router.get("/stats", leadController.getDashboardStats);

// CRUD routes with parameters
router.post("/", authorize(USER_ROLES.ADMIN, USER_ROLES.SALES), validate(createLeadSchema), leadController.createLead);
router.get("/:id", leadController.getLeadById);
router.put("/:id", authorize(USER_ROLES.ADMIN, USER_ROLES.SALES), validate(updateLeadSchema), leadController.updateLead);
router.delete("/:id", authorize(USER_ROLES.ADMIN), leadController.deleteLead);

export default router;
