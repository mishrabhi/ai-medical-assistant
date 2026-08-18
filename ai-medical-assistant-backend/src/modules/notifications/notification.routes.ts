import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware";
import { asyncHandler } from "../../utils/asyncHandler";

import { notificationController } from "./notification.controller";

const router = Router();

router.get("/", authenticate, asyncHandler(notificationController.getAll));

router.patch(
  "/read-all",
  authenticate,
  asyncHandler(notificationController.markAllAsRead),
);

router.get(
  "/unread-count",
  authenticate,
  asyncHandler(notificationController.getUnreadCount),
);

router.patch(
  "/:id/read",
  authenticate,
  asyncHandler(notificationController.markAsRead),
);

export default router;
