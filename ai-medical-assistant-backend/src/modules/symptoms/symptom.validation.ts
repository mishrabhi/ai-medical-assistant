import { z } from "zod";

export const symptomCheckSchema = z.object({
  symptoms: z
    .array(z.string().trim().min(2))
    .min(1)
    .max(20),
});