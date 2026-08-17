export type UserRole = "PATIENT" | "DOCTOR" | "ADMIN";

export type Gender = "MALE" | "FEMALE" | "OTHER";

export type BloodGroup =
  | "A_POSITIVE"
  | "A_NEGATIVE"
  | "B_POSITIVE"
  | "B_NEGATIVE"
  | "AB_POSITIVE"
  | "AB_NEGATIVE"
  | "O_POSITIVE"
  | "O_NEGATIVE";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  avatar?: string | null;
  isVerified: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface UserProfile extends User {
  phone?: string | null;
  dateOfBirth?: string | null;
  bloodGroup?: BloodGroup | null;
  gender?: Gender | null;
  height?: number | null;
  weight?: number | null;
}

export interface UpdateProfilePayload {
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

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}