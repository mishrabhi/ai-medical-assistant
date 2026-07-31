import { Router } from "express";
import { authController } from "./auth.controller";
import {
  loginSchema,
  registerSchema,
} from "./auth.validation";
import { validate } from "../../middlewares/validation.middleware";
import { asyncHandler } from "../../utils/asyncHandler";

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

export default router;