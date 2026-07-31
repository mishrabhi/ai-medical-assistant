import { Response } from "express";
import { env } from "../config/env";

//set refresh token cookies
export const setRefreshTokenCookie = (
  res: Response,
  token: string
) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

//clear refresh token cookies 
export const clearRefreshTokenCookie = (
  res: Response
) => {
  res.clearCookie("refreshToken");
};