export enum DoctorSpecialization {
  CARDIOLOGIST = "CARDIOLOGIST",
  DERMATOLOGIST = "DERMATOLOGIST",
  ENT = "ENT",
  GENERAL_PHYSICIAN = "GENERAL_PHYSICIAN",
  GYNECOLOGIST = "GYNECOLOGIST",
  NEUROLOGIST = "NEUROLOGIST",
  ORTHOPEDIC = "ORTHOPEDIC",
  PEDIATRICIAN = "PEDIATRICIAN",
  PSYCHIATRIST = "PSYCHIATRIST",
  RADIOLOGIST = "RADIOLOGIST",
}

export interface Doctor {
  id: string;
  fullName: string;
  specialization: DoctorSpecialization;
  hospital?: string;
  experienceYears?: number;
  email?: string;
  phone?: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDoctorPayload {
  fullName: string;
  specialization: DoctorSpecialization;
  hospital?: string;
  experienceYears?: number;
  email?: string;
  phone?: string;
}
