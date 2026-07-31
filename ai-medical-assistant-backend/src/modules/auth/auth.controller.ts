import { Request, Response } from "express";
import { authService } from "./auth.service";
import { setRefreshTokenCookie } from "../../lib/cookies";

class AuthController {
 register = async (
    req: Request,
    res: Response
  ) => {
    const result = await authService.register(req.body);

    setRefreshTokenCookie(res, result.refreshToken);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        accessToken: result.accessToken,
        user: result.user,
      },
    });
  };

  login = async (
    req: Request,
    res: Response
  ) => {
    const result = await authService.login(req.body);

    setRefreshTokenCookie(res, result.refreshToken);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        accessToken: result.accessToken,
        user: result.user,
      },
    });
  };
}

export const authController = new AuthController();
