import { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import { config } from "../config/env";

// General API rate limiting
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later.",
    retryAfter: Math.ceil((15 * 60 * 1000) / 1000), // seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiting for auth endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 auth requests per windowMs
  message: {
    error:
      "Too many authentication attempts from this IP, please try again later.",
    retryAfter: Math.ceil((15 * 60 * 1000) / 1000),
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
});

// Very strict rate limiting for sensitive operations
export const sensitiveOpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 sensitive operations per hour
  message: {
    error:
      "Too many sensitive operations from this IP, please try again later.",
    retryAfter: Math.ceil((60 * 60 * 1000) / 1000),
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// IP allowlist middleware (for admin/internal endpoints)
export function ipAllowlist(allowedIPs: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const clientIP = req.ip;

    if (!allowedIPs.includes(clientIP)) {
      return res.status(403).json({
        error: "Access denied from this IP address",
      });
    }

    next();
  };
}

// Request validation middleware
export function validateContentType(allowedTypes: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const contentType = req.get("Content-Type");

    if (req.method !== "GET" && req.method !== "DELETE" && contentType) {
      const isAllowed = allowedTypes.some((type) =>
        contentType.toLowerCase().includes(type.toLowerCase()),
      );

      if (!isAllowed) {
        return res.status(415).json({
          error: "Unsupported Media Type",
          allowed: allowedTypes,
        });
      }
    }

    next();
  };
}

// Request size validation
export function validateRequestSize(maxSizeBytes: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const contentLength = req.get("Content-Length");

    if (contentLength && parseInt(contentLength) > maxSizeBytes) {
      return res.status(413).json({
        error: "Request entity too large",
        maxSize: `${maxSizeBytes} bytes`,
      });
    }

    next();
  };
}

// Security headers middleware (additional to helmet)
export function securityHeaders(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Prevent caching of sensitive responses
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");

  // Additional security headers
  res.set("X-Request-ID", req.get("X-Request-ID") || "unknown");

  next();
}
