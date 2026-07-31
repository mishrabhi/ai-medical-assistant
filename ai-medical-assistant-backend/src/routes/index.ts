import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { successResponse } from "../utils/apiResponse";
import { prisma } from "../lib/prisma";
import redis from "../lib/redis";
import authRoutes from "../modules/auth/auth.routes";
import reportRoutes from "../modules/reports";

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
      "AI Medical Assistant API is healthy"
    );
  })
);

router.use("/auth", authRoutes);
router.use("/reports", reportRoutes);

export default router;