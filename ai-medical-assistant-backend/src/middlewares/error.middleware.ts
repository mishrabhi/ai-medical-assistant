import { NextFunction, Request, Response } from "express";
import { Prisma } from "../generated/prisma/client";
import OpenAI from "openai";
import multer from "multer";

import { ApiError } from "../utils/ApiError";
import { logger } from "../utils/logger";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const error = err as {
    name?: string;
    message?: string;
    stack?: string;
  };

  logger.error("Unhandled application error", {
    name: error?.name,
    message: error?.message,
    stack: error?.stack,
    path: req.originalUrl,
    method: req.method,
  });

  // Multer upload errors
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size must not exceed 10 MB.",
      });
    }

    return res.status(400).json({
      success: false,
      message: "File upload failed.",
    });
  }

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
      message:
        "AI service is currently unavailable. Please try again later.",
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
    message: "Internal Server Error",
  });
};