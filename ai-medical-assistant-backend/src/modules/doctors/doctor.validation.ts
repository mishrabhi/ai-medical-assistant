import { z } from "zod";

export const createDoctorSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2)
    .max(100),

  specialization: z.enum([
    "CARDIOLOGIST",
    "DERMATOLOGIST",
    "ENT",
    "GENERAL_PHYSICIAN",
    "GYNECOLOGIST",
    "NEUROLOGIST",
    "ORTHOPEDIC",
    "PEDIATRICIAN",
    "PSYCHIATRIST",
    "RADIOLOGIST",
  ]),

  hospital: z
    .string()
    .trim()
    .max(150)
    .optional(),

  experienceYears: z
    .number()
    .int()
    .min(0)
    .optional(),

  email: z
    .string()
    .email()
    .optional(),

  phone: z
    .string()
    .trim()
    .optional(),

  profileImage: z
    .string()
    .url()
    .optional(),
});

export const updateAvailabilitySchema =
  z.object({
    isAvailable: z.boolean(),
  });