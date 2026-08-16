import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validation.middleware";
import { asyncHandler } from "../../utils/asyncHandler";

import { chatController } from "./chat.controller";
import {
  createChatSessionSchema,
  sendMessageSchema,
} from "./chat.validation";

import { aiRateLimiter } from "../../middlewares/rateLimiter.middleware";

const router = Router();

router.post(
  "/sessions",
  authenticate,
  validate(createChatSessionSchema),
  asyncHandler(chatController.createSession)
);

router.post(
  "/sessions/:id/messages",
  authenticate,
   aiRateLimiter,
  validate(sendMessageSchema),
  asyncHandler(chatController.sendMessage)
);

router.get(
  "/sessions",
  authenticate,
  asyncHandler(chatController.getSessions)
);

router.get(
  "/sessions/:id",
  authenticate,
  asyncHandler(chatController.getSession)
);

router.get(
  "/sessions/:id/messages",
  authenticate,
  asyncHandler(chatController.getMessages)
);

router.patch(
  "/sessions/:id/archive",
  authenticate,
  asyncHandler(chatController.archiveSession)
);

router.delete(
  "/sessions/:id",
  authenticate,
  asyncHandler(chatController.deleteSession)
);

export default router;