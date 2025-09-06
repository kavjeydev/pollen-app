import { Router, Request, Response } from "express";
import { getDb } from "../db/mongo";
import { logger } from "../config/logger";

const router = Router();

// Plaid IDV webhook endpoint
router.post("/plaid/idv", async (req: Request, res: Response) => {
  try {
    const { webhook_type, webhook_code, identity_verification_id } = req.body;

    logger.info("Received Plaid IDV webhook:", {
      webhook_type,
      webhook_code,
      identity_verification_id,
    });

    if (webhook_type !== "IDENTITY_VERIFICATION") {
      return res.status(400).json({ error: "Invalid webhook type" });
    }

    const db = getDb();

    // Find the KYC session
    const kycSession = await db.collection("kyc_sessions").findOne({
      idv_id: identity_verification_id,
    });

    if (!kycSession) {
      logger.warn(
        `KYC session not found for IDV ID: ${identity_verification_id}`,
      );
      return res.status(404).json({ error: "KYC session not found" });
    }

    let status = "unknown";
    let shouldNotifyUser = false;

    switch (webhook_code) {
      case "APPROVED":
        status = "approved";
        shouldNotifyUser = true;
        break;
      case "REJECTED":
        status = "rejected";
        shouldNotifyUser = true;
        break;
      case "REQUIRES_RETRY":
        status = "requires_retry";
        shouldNotifyUser = true;
        break;
      case "CANCELED":
        status = "canceled";
        break;
      case "FAILED":
        status = "failed";
        shouldNotifyUser = true;
        break;
      case "PENDING_REVIEW":
        status = "pending_review";
        break;
      default:
        logger.warn(`Unknown webhook code: ${webhook_code}`);
        status = webhook_code.toLowerCase();
    }

    // Update KYC session status
    await db.collection("kyc_sessions").updateOne(
      { idv_id: identity_verification_id },
      {
        $set: {
          status,
          webhook_received_at: new Date(),
          updated_at: new Date(),
        },
        $push: {
          webhook_history: {
            webhook_type,
            webhook_code,
            received_at: new Date(),
          },
        },
      },
    );

    // Update user's KYC status if approved
    if (status === "approved") {
      await db.collection("users").updateOne(
        { stytch_user_id: kycSession.user_id },
        {
          $set: {
            kyc_status: "approved",
            kyc_approved_at: new Date(),
            updated_at: new Date(),
          },
        },
        { upsert: true },
      );
    }

    // TODO: Send notification to user if shouldNotifyUser is true
    // This could be email, SMS, or in-app notification

    logger.info(`KYC status updated: ${identity_verification_id} -> ${status}`);
    res.status(200).json({ message: "Webhook processed successfully" });
  } catch (error) {
    logger.error("Plaid IDV webhook error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export { router as webhookRouter };
