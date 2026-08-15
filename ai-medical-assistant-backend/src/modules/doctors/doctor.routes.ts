import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validation.middleware";
import { asyncHandler } from "../../utils/asyncHandler";

import { doctorController } from "./doctor.controller";
import {
  createDoctorSchema,
  updateAvailabilitySchema,
} from "./doctor.validation";

const router = Router();

router.post(
  "/",
  authenticate,
  validate(createDoctorSchema),
  asyncHandler(doctorController.create)
);

router.get(
  "/",
  authenticate,
  asyncHandler(doctorController.getAll)
);

router.get(
  "/:id",
  authenticate,
  asyncHandler(doctorController.getById)
);

router.patch(
  "/:id/availability",
  authenticate,
  validate(updateAvailabilitySchema),
  asyncHandler(
    doctorController.updateAvailability
  )
);

export default router;