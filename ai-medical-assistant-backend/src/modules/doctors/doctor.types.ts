import { DoctorSpecialization } from "../../generated/prisma/enums";

export interface CreateDoctorDTO {
  fullName: string;
  specialization: DoctorSpecialization;
  hospital?: string;
  experienceYears?: number;
  email?: string;
  phone?: string;
  profileImage?: string;
}