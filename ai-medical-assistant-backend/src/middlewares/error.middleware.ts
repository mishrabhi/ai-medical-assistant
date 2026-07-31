import { NextFunction, Request, Response } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  return res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};