import { userRepository } from "./user.repository";
import { UpdateProfileDTO } from "./user.types";
import { comparePassword, hashPassword } from "../../lib/bcrypt";

class UserService {
  //get user profile
  async getProfile(userId: string) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new Error("User not found.");
    }

    const { passwordHash, ...profile } = user;

    return profile;
  }

  //update profile
  async updateProfile(userId: string, data: UpdateProfileDTO) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new Error("User not found.");
    }

    const updatedUser = await userRepository.updateProfile(userId, data);

    const { passwordHash, ...profile } = updatedUser;

    return profile;
  }

  //change-password
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new Error("User not found.");
    }

    const isValid = await comparePassword(currentPassword, user.passwordHash);

    if (!isValid) {
      throw new Error("Current password is incorrect.");
    }

    const passwordHash = await hashPassword(newPassword);

    await userRepository.updatePassword(userId, passwordHash);

    return {
      message: "Password changed successfully.",
    };
  }

  //update avatar
  async updateAvatar(
  userId: string,
  avatar: string
) {
  const user =
    await userRepository.findById(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  const updatedUser =
    await userRepository.updateAvatar(
      userId,
      avatar
    );

  const {
    passwordHash,
    ...profile
  } = updatedUser;

  return profile;
}

//deactivate account
async deactivateAccount(
  userId: string
) {
  const user =
    await userRepository.findById(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  await userRepository.updateAccountStatus(
    userId,
    false
  );

  return {
    message:
      "Account deactivated successfully.",
  };
}
}

export const userService = new UserService();
