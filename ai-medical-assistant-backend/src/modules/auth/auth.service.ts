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

export class AuthService {
  //register user
  async register(data: RegisterUserDTO) {
    const existingUser = await authRepository.findUserByEmail(data.email);

    if (existingUser) {
      throw new Error("User already exists");
    }

    const passwordHash = await hashPassword(data.password);

    const user = await authRepository.createUser({
      ...data,
      passwordHash,
    });

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
      user,
    };
  }

  //login user
  async login(data: LoginUserDTO) {
    const user = await authRepository.findUserByEmail(data.email);

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const passwordMatch = await comparePassword(
      data.password,
      user.passwordHash,
    );

    if (!passwordMatch) {
      throw new Error("Invalid credentials");
    }

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
      user,
    };
  }

  //get current logged-in user
  async getCurrentUser(userId: string) {
    const user = await authRepository.getCurrentUser(userId);

    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  //generate new refresh-token
  async refreshToken(token: string) {
    const storedToken = await authRepository.findRefreshToken(token);

    if (!storedToken) {
      throw new Error("Invalid refresh token");
    }

    const payload = verifyRefreshToken(token);

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
