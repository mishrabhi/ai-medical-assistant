import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { successResponse } from "../utils/apiResponse";
import { prisma } from "../lib/prisma";
import redis from "../lib/redis";
import authRoutes from "../modules/auth/auth.routes";
import reportRoutes from "../modules/reports";
import symptomRoutes from "../modules/symptoms";
import chatRoutes from "../modules/chat";
import doctorRoutes, { adminDoctorRoutes } from "../modules/doctors";
import appointmentRoutes from "../modules/appointments";
import reminderRoutes from "../modules/reminders";
import notificationRoutes from "../modules/notifications";
import emergencyContactRoutes from "../modules/emergency-contacts";
import userRoutes from "../modules/users";
import adminRoutes from "../modules/admin";

const router = Router();

router.get(
  "/health",
  asyncHandler(async (_req, res) => {
    await prisma.$queryRaw`SELECT 1`;

    await redis.ping();

    return successResponse(
      res,
      {
        database: "Connected",
        redis: "Connected",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      },
      "AI Medical Assistant API is healthy",
    );
  }),
);

router.use("/auth", authRoutes);
router.use("/reports", reportRoutes);
router.use("/symptoms", symptomRoutes);
router.use("/chat", chatRoutes);
router.use("/doctors", doctorRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/reminders", reminderRoutes);
router.use("/notifications", notificationRoutes);
router.use("/emergency-contacts", emergencyContactRoutes);
router.use("/users", userRoutes);
router.use("/admin/doctors", adminDoctorRoutes);
router.use("/admin", adminRoutes);

export default router;
