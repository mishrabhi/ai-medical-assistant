import { z } from "zod";

export const createAppointmentSchema = z.object({
  doctorId: z.string().min(1),

  appointmentDate: z.string().datetime(),

  reason: z.string().trim().max(500).optional(),

  notes: z.string().trim().max(1000).optional(),
});

export const updateAppointmentStatusSchema = z.object({
  status: z.enum(["CONFIRMED", "COMPLETED", "CANCELLED"]),
});
