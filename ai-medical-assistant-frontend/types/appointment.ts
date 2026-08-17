import type { Doctor } from "./doctor";

export enum AppointmentStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface Appointment {
  id: string;
  userId: string;
  doctorId: string;
  doctor?: Doctor;
  appointmentDate: string;
  reason?: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentPayload {
  doctorId: string;
  appointmentDate: string;
  reason?: string;
  notes?: string;
}

export interface UpdateAppointmentStatusPayload {
  status: AppointmentStatus;
}
