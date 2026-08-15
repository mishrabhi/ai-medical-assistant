import { z } from "zod";

export const createEmergencyContactSchema =
  z.object({
    name: z
      .string()
      .trim()
      .min(2)
      .max(100),

    relation: z
      .string()
      .trim()
      .min(2)
      .max(50),

    phone: z
      .string()
      .trim()
      .min(7)
      .max(20),
  });

export const updateEmergencyContactSchema =
  z.object({
    name: z
      .string()
      .trim()
      .min(2)
      .max(100)
      .optional(),

    relation: z
      .string()
      .trim()
      .min(2)
      .max(50)
      .optional(),

    phone: z
      .string()
      .trim()
      .min(7)
      .max(20)
      .optional(),
  });