import { z } from "zod";

export const uploadReportSchema = z.object({
  title: z.string().trim().min(2),

  reportType: z.enum([
    "BLOOD_TEST",
    "XRAY",
    "MRI",
    "CT_SCAN",
    "ULTRASOUND",
    "PRESCRIPTION",
    "OTHER",
  ]),
});