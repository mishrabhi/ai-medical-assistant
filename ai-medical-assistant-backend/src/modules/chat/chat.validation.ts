import { z } from "zod";

export const createChatSessionSchema =
  z.object({
    title: z
      .string()
      .trim()
      .min(1)
      .max(100)
      .optional(),
  });

export const sendMessageSchema =
  z.object({
    message: z
      .string()
      .trim()
      .min(1)
      .max(5000),
  });