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
  hospital?: string | null;
  experienceYears?: number | null;
  email?: string | null;
  phone?: string | null;
  profileImage?: string | null;
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
  profileImage?: string;
}

export interface UpdateDoctorPayload {
  fullName?: string;
  specialization?: DoctorSpecialization;
  hospital?: string;
  experienceYears?: number;
  email?: string;
  phone?: string;
  profileImage?: string;
}

export const doctorSpecializationLabels: Record<
  DoctorSpecialization,
  string
> = {
  CARDIOLOGIST: "Cardiologist",
  DERMATOLOGIST: "Dermatologist",
  ENT: "ENT",
  GENERAL_PHYSICIAN: "General Physician",
  GYNECOLOGIST: "Gynecologist",
  NEUROLOGIST: "Neurologist",
  ORTHOPEDIC: "Orthopedic",
  PEDIATRICIAN: "Pediatrician",
  PSYCHIATRIST: "Psychiatrist",
  RADIOLOGIST: "Radiologist",
};