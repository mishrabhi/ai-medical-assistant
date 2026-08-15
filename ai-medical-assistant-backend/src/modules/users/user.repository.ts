import { prisma } from "../../lib/prisma";
import { UpdateProfileDTO } from "./user.types";

class UserRepository {
  //find user by id
  async findById(id: string) {
    return prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  //update user profile
  async updateProfile(id: string, data: UpdateProfileDTO) {
    return prisma.user.update({
      where: {
        id,
      },
      data: {
        ...(data.firstName !== undefined && {
          firstName: data.firstName,
        }),

        ...(data.lastName !== undefined && {
          lastName: data.lastName,
        }),

        ...(data.phone !== undefined && {
          phone: data.phone,
        }),

        ...(data.avatar !== undefined && {
          avatar: data.avatar,
        }),

        ...(data.gender !== undefined && {
          gender: data.gender,
        }),

        ...(data.bloodGroup !== undefined && {
          bloodGroup: data.bloodGroup,
        }),

        ...(data.dateOfBirth !== undefined && {
          dateOfBirth: new Date(data.dateOfBirth),
        }),

        ...(data.height !== undefined && {
          height: data.height,
        }),

        ...(data.weight !== undefined && {
          weight: data.weight,
        }),
      },
    });
  }

  //update password
  async updatePassword(id: string, passwordHash: string) {
    return prisma.user.update({
      where: {
        id,
      },
      data: {
        passwordHash,
      },
    });
  }

  //update avatar
  async updateAvatar(id: string, avatar: string) {
    return prisma.user.update({
      where: {
        id,
      },
      data: {
        avatar,
      },
    });
  }

  //update account status
  async updateAccountStatus(id: string, isActive: boolean) {
    return prisma.user.update({
      where: {
        id,
      },
      data: {
        isActive,
      },
    });
  }
}

export const userRepository = new UserRepository();
