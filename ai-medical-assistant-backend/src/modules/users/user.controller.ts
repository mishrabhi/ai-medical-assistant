import { Request, Response } from "express";
import { userService } from "./user.service";

class UserController {
  //get user profile
  getProfile = async (req: Request, res: Response) => {
    const result = await userService.getProfile(req.user!.userId);

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully.",
      data: result,
    });
  };

  //update user profile
  updateProfile = async (req: Request, res: Response) => {
    const result = await userService.updateProfile(req.user!.userId, req.body);

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      data: result,
    });
  };

  //change-password
  changePassword = async (req: Request, res: Response) => {
    const result = await userService.changePassword(
      req.user!.userId,
      req.body.currentPassword,
      req.body.newPassword,
    );

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  };

  //update avatar
  updateAvatar = async (req: Request, res: Response) => {
    const result = await userService.updateAvatar(
      req.user!.userId,
      req.body.avatar,
    );

    return res.status(200).json({
      success: true,
      message: "Profile picture updated successfully.",
      data: result,
    });
  };

  //deactivate account
  deactivateAccount = async (req: Request, res: Response) => {
    const result = await userService.deactivateAccount(req.user!.userId);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  };
}

export const userController = new UserController();
