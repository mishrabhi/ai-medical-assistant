import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validation.middleware";
import { asyncHandler } from "../../utils/asyncHandler";

import {
  emergencyContactController,
} from "./emergency-contact.controller";

import {
  createEmergencyContactSchema,
  updateEmergencyContactSchema,
} from "./emergency-contact.validation";

const router = Router();

router.post(
  "/",
  authenticate,
  validate(createEmergencyContactSchema),
  asyncHandler(
    emergencyContactController.create
  )
);

router.get(
  "/",
  authenticate,
  asyncHandler(
    emergencyContactController.getAll
  )
);

router.get(
  "/:id",
  authenticate,
  asyncHandler(
    emergencyContactController.getById
  )
);

router.patch(
  "/:id",
  authenticate,
  validate(updateEmergencyContactSchema),
  asyncHandler(
    emergencyContactController.update
  )
);

router.delete(
  "/:id",
  authenticate,
  asyncHandler(
    emergencyContactController.delete
  )
);

router.get(
  "/emergency",
  authenticate,
  asyncHandler(
    emergencyContactController.getEmergencyContacts
  )
);

export default router;