import { Router, Request, Response } from "express";
import { z } from "zod";
import { createIDVSession, getIDVStatus, retryIDVSession } from "./plaid";
import { requireAuth } from "../auth/middleware";
import { getDb } from "../db/mongo";
import { logger } from "../config/logger";

const router = Router();

// Start KYC process
router.post("/start", requireAuth, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const userId = req.user.user_id;

    // Check if user already has an active IDV session
    const db = getDb();
    const existingSession = await db.collection("kyc_sessions").findOne({
      user_id: userId,
      status: { $in: ["pending", "active"] },
    });

    if (existingSession) {
      return res.json({
        message: "KYC session already exists",
        shareable_url: existingSession.shareable_url,
        idv_id: existingSession.idv_id,
      });
    }

    // Create new IDV session
    const shareableUrl = await createIDVSession(userId);
    if (!shareableUrl) {
      return res.status(500).json({ error: "Failed to create KYC session" });
    }

    // Store session in database
    const kycSession = {
      user_id: userId,
      idv_id: shareableUrl.split("/").pop(), // Extract IDV ID from URL
      shareable_url: shareableUrl,
      status: "pending",
      created_at: new Date(),
      updated_at: new Date(),
    };

    await db.collection("kyc_sessions").insertOne(kycSession);

    res.json({
      message: "KYC session created successfully",
      shareable_url: shareableUrl,
      idv_id: kycSession.idv_id,
    });
  } catch (error) {
    logger.error("KYC start error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get KYC status
router.get("/status", requireAuth, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const userId = req.user.user_id;
    const db = getDb();

    const kycSession = await db.collection("kyc_sessions").findOne(
      {
        user_id: userId,
      },
      { sort: { created_at: -1 } },
    );

    if (!kycSession) {
      return res.status(404).json({ error: "No KYC session found" });
    }

    // Get latest status from Plaid
    const idvStatus = await getIDVStatus(kycSession.idv_id);
    if (!idvStatus) {
      return res.status(500).json({ error: "Failed to get KYC status" });
    }

    // Update local status
    await db.collection("kyc_sessions").updateOne(
      { _id: kycSession._id },
      {
        $set: {
          status: idvStatus.status,
          updated_at: new Date(),
          plaid_data: idvStatus,
        },
      },
    );

    res.json({
      idv_id: kycSession.idv_id,
      status: idvStatus.status,
      steps: idvStatus.steps,
      shareable_url: kycSession.shareable_url,
    });
  } catch (error) {
    logger.error("KYC status error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Retry KYC session
router.post("/retry", requireAuth, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const userId = req.user.user_id;
    const db = getDb();

    const kycSession = await db.collection("kyc_sessions").findOne(
      {
        user_id: userId,
        status: { $in: ["failed", "expired"] },
      },
      { sort: { created_at: -1 } },
    );

    if (!kycSession) {
      return res
        .status(404)
        .json({ error: "No failed KYC session found to retry" });
    }

    const shareableUrl = await retryIDVSession(kycSession.idv_id);
    if (!shareableUrl) {
      return res.status(500).json({ error: "Failed to retry KYC session" });
    }

    // Update session
    await db.collection("kyc_sessions").updateOne(
      { _id: kycSession._id },
      {
        $set: {
          shareable_url: shareableUrl,
          status: "pending",
          updated_at: new Date(),
        },
      },
    );

    res.json({
      message: "KYC session retried successfully",
      shareable_url: shareableUrl,
      idv_id: kycSession.idv_id,
    });
  } catch (error) {
    logger.error("KYC retry error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export { router as kycRouter };
