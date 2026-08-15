import { z } from "zod";

export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2)
    .max(50)
    .optional(),

  lastName: z
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

  avatar: z
    .string()
    .url()
    .optional(),

  gender: z
    .enum([
      "MALE",
      "FEMALE",
      "OTHER",
    ])
    .optional(),

  bloodGroup: z
    .enum([
      "A_POSITIVE",
      "A_NEGATIVE",
      "B_POSITIVE",
      "B_NEGATIVE",
      "AB_POSITIVE",
      "AB_NEGATIVE",
      "O_POSITIVE",
      "O_NEGATIVE",
    ])
    .optional(),

  dateOfBirth: z
    .string()
    .datetime()
    .optional(),

  height: z
    .number()
    .positive()
    .optional(),

  weight: z
    .number()
    .positive()
    .optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1),

  newPassword: z
    .string()
    .min(8)
    .max(100),
});

export const updateAvatarSchema = z.object({
  avatar: z.string().url(),
});