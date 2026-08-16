import { NextFunction, Request, Response } from "express";
import { Prisma } from "../generated/prisma/client";
import OpenAI from "openai";
import { ApiError } from "../utils/ApiError";
import { env } from "../config/env";
import { logger } from "../utils/logger";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.error("Unhandled application error", {
    name: err?.name,
    message: err?.message,
    stack: err?.stack,
    path: req.originalUrl,
    method: req.method,
  });

  // OpenAI errors
  if (err instanceof OpenAI.APIError) {
    if (err.status === 429) {
      return res.status(429).json({
        success: false,
        message:
          "AI service quota or rate limit exceeded. Please try again later.",
      });
    }

    return res.status(502).json({
      success: false,
      message: "AI service is currently unavailable. Please try again later.",
    });
  }

  // Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "A record with this value already exists.",
      });
    }

    if (err.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Record not found.",
      });
    }
  }

  // Intentional application errors
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Unexpected errors
  return res.status(500).json({
    success: false,
    message:
      env.NODE_ENV === "development"
        ? err.message || "Internal Server Error"
        : "Internal Server Error",
  });
};
