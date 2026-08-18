import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware";
import { requireAdmin } from "../../middlewares/admin.middleware";
import { validate } from "../../middlewares/validation.middleware";
import { asyncHandler } from "../../utils/asyncHandler";

import { updateAppointmentStatusSchema } from "./appointment.validation";
import { adminAppointmentController } from "./admin-appointment.controller";

const router = Router();

router.use(authenticate, requireAdmin);

router.get(
  "/",
  asyncHandler(adminAppointmentController.getAll),
);

router.get(
  "/:id",
  asyncHandler(adminAppointmentController.getById),
);

router.patch(
  "/:id/status",
  validate(updateAppointmentStatusSchema),
  asyncHandler(adminAppointmentController.updateStatus),
);

export default router;