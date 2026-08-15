import { AppointmentStatus } from "../../generated/prisma/enums";

export interface CreateAppointmentDTO {
  doctorId: string;
  appointmentDate: string;
  reason?: string;
  notes?: string;
}