import { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger";

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export function createError(
  message: string,
  statusCode: number = 500,
): AppError {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const { statusCode = 500, message, stack } = err;

  // Log error
  logger.error("Error occurred:", {
    message,
    statusCode,
    stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });

  // Don't expose stack trace in production
  const isDevelopment = process.env.NODE_ENV === "development";

  res.status(statusCode).json({
    error: {
      message,
      ...(isDevelopment && { stack }),
      timestamp: new Date().toISOString(),
      path: req.path,
    },
  });
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    error: {
      message: `Route ${req.method} ${req.path} not found`,
      timestamp: new Date().toISOString(),
      path: req.path,
    },
  });
}
