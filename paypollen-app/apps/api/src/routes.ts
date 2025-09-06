import { Express } from "express";
import { authRouter } from "./auth/routes";
import { kycRouter } from "./kyc/routes";
import { piiRouter } from "./pii/routes";
import { webhookRouter } from "./kyc/webhook";
import { notFoundHandler } from "./middleware/error";
import {
  authLimiter,
  sensitiveOpLimiter,
  generalLimiter,
} from "./middleware/security";

export function setupRoutes(app: Express): void {
  // Apply general rate limiting to all API routes
  app.use("/api", generalLimiter);

  // Authentication routes
  app.use("/api/auth", authLimiter, authRouter);

  // KYC routes
  app.use("/api/kyc", kycRouter);

  // PII routes (sensitive operations)
  app.use("/api/pii", sensitiveOpLimiter, piiRouter);

  // Webhook routes (no rate limiting for webhooks)
  app.use("/webhooks", webhookRouter);

  // API documentation/status
  app.get("/api", (req, res) => {
    res.json({
      service: "PayPollen API",
      version: "1.0.0",
      status: "operational",
      timestamp: new Date().toISOString(),
      endpoints: {
        auth: "/api/auth",
        kyc: "/api/kyc",
        pii: "/api/pii",
        webhooks: "/webhooks",
        health: "/health",
      },
    });
  });

  // 404 handler for unmatched routes
  app.use("*", notFoundHandler);
}
