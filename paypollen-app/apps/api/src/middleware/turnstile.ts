import { Request, Response, NextFunction } from "express";
import { config } from "../config/env";
import { logger } from "../config/logger";

interface TurnstileResponse {
  success: boolean;
  "error-codes"?: string[];
  challenge_ts?: string;
  hostname?: string;
}

export async function validateTurnstile(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const turnstileToken =
      req.headers["cf-turnstile-response"] || req.body["cf-turnstile-response"];

    if (!turnstileToken) {
      return res.status(400).json({ error: "Turnstile token required" });
    }

    // Verify with Cloudflare Turnstile
    const formData = new URLSearchParams();
    formData.append("secret", config.TURNSTILE_SECRET_KEY);
    formData.append("response", turnstileToken as string);
    formData.append("remoteip", req.ip);

    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      },
    );

    const result: TurnstileResponse = await response.json();

    if (!result.success) {
      logger.warn("Turnstile validation failed:", {
        errors: result["error-codes"],
        ip: req.ip,
        hostname: result.hostname,
      });

      return res.status(400).json({
        error: "Turnstile validation failed",
        codes: result["error-codes"],
      });
    }

    // Validation successful
    next();
  } catch (error) {
    logger.error("Turnstile validation error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Optional Turnstile validation (doesn't block request if missing)
export async function optionalTurnstile(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const turnstileToken =
    req.headers["cf-turnstile-response"] || req.body["cf-turnstile-response"];

  if (!turnstileToken) {
    // No token provided, continue without validation
    return next();
  }

  // Token provided, validate it
  return validateTurnstile(req, res, next);
}
