export type UserRole = "PATIENT" | "DOCTOR" | "ADMIN";

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
  bloodGroup?: string | null;
}
