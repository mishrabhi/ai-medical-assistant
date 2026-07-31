import { Router } from "express";
import { authController } from "./auth.controller";
import {
  loginSchema,
  registerSchema,
} from "./auth.validation";
import { validate } from "../../middlewares/validation.middleware";
import { asyncHandler } from "../../utils/asyncHandler";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.post(
    "/register",
    validate(registerSchema),
    asyncHandler(authController.register)
);

router.post(
    "/login",
    validate(loginSchema),
    asyncHandler(authController.login)
);

router.get(
  "/me",
  authenticate,
  asyncHandler(authController.me)
);

router.post(
  "/refresh",
  asyncHandler(authController.refresh)
);

router.post(
  "/logout",
  asyncHandler(authController.logout)
);

export default router;