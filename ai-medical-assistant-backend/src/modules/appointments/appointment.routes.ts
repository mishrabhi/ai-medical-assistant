import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validation.middleware";
import { asyncHandler } from "../../utils/asyncHandler";

import { appointmentController } from "./appointment.controller";
import {
  createAppointmentSchema,
  updateAppointmentStatusSchema,
} from "./appointment.validation";



const router = Router();

router.post(
  "/",
  authenticate,
  validate(createAppointmentSchema),
  asyncHandler(appointmentController.create)
);

router.get(
  "/",
  authenticate,
  asyncHandler(appointmentController.getAll)
);

router.get(
  "/:id",
  authenticate,
  asyncHandler(appointmentController.getById)
);

router.patch(
  "/:id/status",
  authenticate,
  validate(updateAppointmentStatusSchema),
  asyncHandler(
    appointmentController.updateStatus
  )
);

router.delete(
  "/:id",
  authenticate,
  asyncHandler(
    appointmentController.delete
  )
);

export default router;