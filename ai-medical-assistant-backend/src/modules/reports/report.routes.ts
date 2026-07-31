import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validation.middleware";
import { asyncHandler } from "../../utils/asyncHandler";

import { uploadReport } from "../../middlewares/upload.middleware";

import { reportController } from "./report.controller";
import { uploadReportSchema } from "./report.validation";

const router = Router();

router.post(
  "/",
  authenticate,
  uploadReport.single("report"),
  validate(uploadReportSchema),
  asyncHandler(reportController.upload)
);

router.get(
  "/",
  authenticate,
  asyncHandler(reportController.getAll)
);

router.get(
  "/:id",
  authenticate,
  asyncHandler(reportController.getById)
);

router.delete(
  "/:id",
  authenticate,
  asyncHandler(reportController.delete)
);

export default router;