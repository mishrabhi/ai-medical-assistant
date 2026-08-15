import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware";
import { requireAdmin } from "../../middlewares/admin.middleware";
import { asyncHandler } from "../../utils/asyncHandler";

import { adminController } from "./admin.controller";

const router = Router();

router.use(
  authenticate,
  requireAdmin
);

router.get(
  "/dashboard",
  asyncHandler(
    adminController.getDashboard
  )
);

export default router;