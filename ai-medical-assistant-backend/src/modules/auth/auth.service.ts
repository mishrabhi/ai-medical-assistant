import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { comparePassword, hashPassword } from "../../lib/bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../lib/jwt";
import { AuthRepository, authRepository } from "./auth.repository";
import { LoginUserDTO, RegisterUserDTO } from "./auth.types";
import { ApiError } from "../../utils/ApiError";

export class AuthService {
  //register user
  async register(data: RegisterUserDTO) {
    const existingUser = await authRepository.findUserByEmail(data.email);

    if (existingUser) {
      throw new ApiError(409, "User already exists");
    }

    const passwordHash = await hashPassword(data.password);

    const user = await authRepository.createUser({
      ...data,
      passwordHash,
    });

    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    };

    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);

    const refreshToken = generateRefreshToken(payload);

    const decoded = jwt.decode(refreshToken) as {
      exp: number;
    };

    await authRepository.createRefreshToken(
      user.id,
      refreshToken,
      new Date(decoded.exp * 1000),
    );

    return {
      accessToken,
      refreshToken,
      user: safeUser,
    };
  }

  //login user
  async login(data: LoginUserDTO) {
    const user = await authRepository.findUserByEmail(data.email);

    if (!user) {
      throw new ApiError(401, "Invalid credentials");
    }

    const passwordMatch = await comparePassword(
      data.password,
      user.passwordHash,
    );

    if (!passwordMatch) {
      throw new ApiError(401, "Invalid credentials");
    }

    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    };

    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);

    const refreshToken = generateRefreshToken(payload);

    const decoded = jwt.decode(refreshToken) as {
      exp: number;
    };

    await authRepository.createRefreshToken(
      user.id,
      refreshToken,
      new Date(decoded.exp * 1000),
    );

    return {
      accessToken,
      refreshToken,
      user: safeUser,
    };
  }

  //get current logged-in user
  async getCurrentUser(userId: string) {
    const user = await authRepository.getCurrentUser(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }
    return user;
  }

  //generate new refresh-token
  async refreshToken(token: string) {
    const storedToken = await authRepository.findRefreshToken(token);

    if (!storedToken) {
      throw new ApiError(401, "Invalid refresh token");
    }

    let payload;

    try {
      payload = verifyRefreshToken(token);
    } catch {
      throw new ApiError(401, "Invalid refresh token");
    }

    await authRepository.deleteRefreshToken(token);

    const newPayload = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    };

    const accessToken = generateAccessToken(newPayload);

    const refreshToken = generateRefreshToken(newPayload);

    const decoded = jwt.decode(refreshToken) as {
      exp: number;
    };

    await authRepository.createRefreshToken(
      payload.userId,
      refreshToken,
      new Date(decoded.exp * 1000),
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(token: string) {
    await authRepository.deleteRefreshToken(token);
  }
}

export const authService = new AuthService();
