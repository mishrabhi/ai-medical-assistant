import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().min(2).max(50),

  lastName: z.string().min(2).max(50),

  email: z.email(),

  password: z.string().min(8).max(100),
});

export const loginSchema = z.object({
  email: z.email(),

  password: z.string(),
});

export type RegisterSchema = z.infer<typeof registerSchema>;

export type LoginSchema = z.infer<typeof loginSchema>;
