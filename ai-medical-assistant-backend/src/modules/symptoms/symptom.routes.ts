import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validation.middleware";
import { asyncHandler } from "../../utils/asyncHandler";

import { symptomController } from "./symptom.controller";
import { symptomCheckSchema } from "./symptom.validation";

import { aiRateLimiter } from "../../middlewares/rateLimiter.middleware";

const router = Router();

router.post(
  "/check",
  authenticate,
  aiRateLimiter,
  validate(symptomCheckSchema),
  asyncHandler(symptomController.check)
);

router.get(
  "/",
  authenticate,
  asyncHandler(symptomController.getHistory)
);

router.get(
  "/:id",
  authenticate,
  asyncHandler(symptomController.getById)
);

router.delete(
  "/:id",
  authenticate,
  asyncHandler(symptomController.delete)
);

export default router;