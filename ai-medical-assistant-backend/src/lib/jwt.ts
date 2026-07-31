import jwt, { SignOptions } from "jsonwebtoken"
import {env} from "../config/env";

export interface JwtPayload {
    userId: string,
    email: string,
    role: string
}

//generate accessToken
export const generateAccessToken = (
  payload: JwtPayload
): string => {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  } as SignOptions);
};

//generate refreshToken
export const generateRefreshToken = (
  payload: JwtPayload
): string => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  } as SignOptions);
};

//verify accessToken
export const verifyAccessToken = (
  token: string
): JwtPayload => {
  return jwt.verify(
    token,
    env.JWT_ACCESS_SECRET
  ) as JwtPayload;
};

//verify refreshToken
export const verifyRefreshToken = (
  token: string
): JwtPayload => {
  return jwt.verify(
    token,
    env.JWT_REFRESH_SECRET
  ) as JwtPayload;
}