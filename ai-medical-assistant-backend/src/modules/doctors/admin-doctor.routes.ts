import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware";
import { requireAdmin } from "../../middlewares/admin.middleware";
import { validate } from "../../middlewares/validation.middleware";
import { asyncHandler } from "../../utils/asyncHandler";

import { adminDoctorController } from "./admin-doctor.controller";

import {
  createDoctorSchema,
  updateDoctorSchema,
  updateAvailabilitySchema,
} from "./doctor.validation";

const router = Router();

router.use(
  authenticate,
  requireAdmin
);

router.post(
  "/",
  validate(createDoctorSchema),
  asyncHandler(
    adminDoctorController.create
  )
);

router.patch(
  "/:id",
  validate(updateDoctorSchema),
  asyncHandler(
    adminDoctorController.update
  )
);

router.delete(
  "/:id",
  asyncHandler(
    adminDoctorController.delete
  )
);

router.patch(
  "/:id/availability",
  validate(updateAvailabilitySchema),
  asyncHandler(
    adminDoctorController.updateAvailability
  )
);

export default router;