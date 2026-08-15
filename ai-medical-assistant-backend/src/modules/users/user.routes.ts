import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validation.middleware";
import { asyncHandler } from "../../utils/asyncHandler";

import { userController } from "./user.controller";
import { updateProfileSchema, changePasswordSchema, updateAvatarSchema, } from "./user.validation";



const router = Router();

router.get(
  "/me",
  authenticate,
  asyncHandler(userController.getProfile)
);

router.patch(
  "/me",
  authenticate,
  validate(updateProfileSchema),
  asyncHandler(userController.updateProfile)
);

router.patch(
  "/change-password",
  authenticate,
  validate(changePasswordSchema),
  asyncHandler(
    userController.changePassword
  )
);

router.patch(
  "/avatar",
  authenticate,
  validate(updateAvatarSchema),
  asyncHandler(
    userController.updateAvatar
  )
);

router.patch(
  "/deactivate",
  authenticate,
  asyncHandler(
    userController.deactivateAccount
  )
);

export default router;