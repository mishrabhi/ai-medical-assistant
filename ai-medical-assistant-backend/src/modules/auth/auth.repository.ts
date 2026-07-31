import { prisma } from "../../lib/prisma";
import type { RegisterUserDTO } from "./auth.types";

export class AuthRepository {
  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async createUser(
    data: RegisterUserDTO & { passwordHash: string }
  ) {
    return prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        passwordHash: data.passwordHash,
      },
    });
  }

  async createRefreshToken(
    userId: string,
    token: string,
    expiresAt: Date
  ) {
    return prisma.refreshToken.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });
  }

   async findRefreshToken(token: string) {
    return prisma.refreshToken.findUnique({
      where: { token },
      include: {
        user: true,
      },
    });
  }

   async deleteRefreshToken(token: string) {
    return prisma.refreshToken.delete({
      where: {
        token,
      },
    });
  }

  async deleteAllRefreshTokens(userId: string) {
    return prisma.refreshToken.deleteMany({
      where: {
        userId,
      },
    });
  }

  async getCurrentUser(id: string) {
  return prisma.user.findUnique({
    where: {
      id,
    },

    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      avatar: true,
      isVerified: true,
      createdAt: true,
    },
  });
}
}

export const authRepository = new AuthRepository();

