import { Request, Response, NextFunction } from "express";
import { authenticateSession, StytchUser } from "./stytch";
import { logger } from "../config/logger";

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: StytchUser;
    }
  }
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Missing or invalid authorization header" });
    }

    const sessionToken = authHeader.substring(7);
    const user = await authenticateSession(sessionToken);

    if (!user) {
      return res.status(401).json({ error: "Invalid or expired session" });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error("Authentication middleware error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const sessionToken = authHeader.substring(7);
      const user = await authenticateSession(sessionToken);
      if (user) {
        req.user = user;
      }
    }
    next();
  } catch (error) {
    logger.error("Optional auth middleware error:", error);
    // Continue without authentication for optional auth
    next();
  }
}

// Step-up authentication for sensitive operations
export async function requireStepUp(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Check if user has completed step-up authentication recently
    const stepUpHeader = req.headers["x-step-up-token"];
    if (!stepUpHeader) {
      return res.status(403).json({
        error: "Step-up authentication required",
        step_up_required: true,
      });
    }

    // Validate step-up token (implement based on your step-up flow)
    // This could be a short-lived token that requires re-authentication

    next();
  } catch (error) {
    logger.error("Step-up authentication error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
