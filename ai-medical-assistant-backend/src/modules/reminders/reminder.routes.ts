import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validation.middleware";
import { asyncHandler } from "../../utils/asyncHandler";

import { reminderController } from "./reminder.controller";
import {
  createReminderSchema,
  updateReminderSchema,
  updateReminderStatusSchema,
} from "./reminder.validation";



const router = Router();

router.post(
  "/",
  authenticate,
  validate(createReminderSchema),
  asyncHandler(reminderController.create)
);

router.get(
  "/",
  authenticate,
  asyncHandler(reminderController.getAll)
);

router.get(
  "/:id",
  authenticate,
  asyncHandler(reminderController.getById)
);

router.patch(
  "/:id",
  authenticate,
  validate(updateReminderSchema),
  asyncHandler(reminderController.update)
);

router.delete(
  "/:id",
  authenticate,
  asyncHandler(reminderController.delete)
);

router.patch(
  "/:id/status",
  authenticate,
  validate(updateReminderStatusSchema),
  asyncHandler(
    reminderController.updateStatus
  )
);

router.patch(
  "/:id/complete",
  authenticate,
  asyncHandler(reminderController.complete)
);

export default router;