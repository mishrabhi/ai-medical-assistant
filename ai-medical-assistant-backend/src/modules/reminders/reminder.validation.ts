import { z } from "zod";

export const createReminderSchema = z.object({
  title: z.string().trim().min(1).max(150),

  description: z.string().trim().max(500).optional(),

  scheduledFor: z.string().datetime(),

  repeatInterval: z.enum(["NONE", "DAILY", "WEEKLY", "MONTHLY"]).optional(),
});

export const updateReminderSchema = z.object({
  title: z.string().trim().min(1).max(150).optional(),

  description: z.string().trim().max(500).optional(),

  scheduledFor: z.string().datetime().optional(),

  repeatInterval: z
    .enum(["NONE", "DAILY", "WEEKLY", "MONTHLY", "CUSTOM"])
    .optional(),
});

export const updateReminderStatusSchema = z.object({
  status: z.enum(["ACTIVE", "PAUSED", "COMPLETED"]),
});
