import {
  Gender,
  BloodGroup,
} from "../../generated/prisma/enums";

export interface UpdateProfileDTO {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  gender?: Gender;
  bloodGroup?: BloodGroup;
  dateOfBirth?: string;
  height?: number;
  weight?: number;
}

export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
}