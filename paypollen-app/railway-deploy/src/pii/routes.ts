import { Router, Request, Response } from "express";
import { z } from "zod";
import { requireAuth, requireStepUp } from "../auth/middleware";
import { getUserPII, updateUserPII, deleteUserPII } from "./service";
import { logger } from "../config/logger";

const router = Router();

// Get user PII (admin/audit only - requires step-up auth)
router.get(
  "/:userId",
  requireAuth,
  requireStepUp,
  async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;

      // Additional authorization check - only admins or the user themselves
      if (req.user?.user_id !== userId && !isAdmin(req.user)) {
        return res.status(403).json({ error: "Insufficient permissions" });
      }

      const userPII = await getUserPII(userId);
      if (!userPII) {
        return res.status(404).json({ error: "User not found" });
      }

      // Log the PII access for audit purposes
      logger.info(`PII accessed for user ${userId} by ${req.user?.user_id}`, {
        accessed_by: req.user?.user_id,
        target_user: userId,
        timestamp: new Date(),
        ip_address: req.ip,
      });

      res.json({
        user_id: userPII.stytch_user_id,
        email: userPII.email,
        phone: userPII.phone,
        // Only return SSN to admins
        ...(isAdmin(req.user) && { ssn: userPII.ssn }),
        address: userPII.address,
        created_at: userPII.created_at,
        updated_at: userPII.updated_at,
      });
    } catch (error) {
      logger.error("Get PII error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// Update user PII
const updatePIISchema = z.object({
  phone: z.string().optional(),
  address: z
    .object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
      zipCode: z.string(),
    })
    .optional(),
});

router.put("/:userId", requireAuth, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    // Users can only update their own PII
    if (req.user?.user_id !== userId) {
      return res
        .status(403)
        .json({ error: "Can only update your own information" });
    }

    const updateData = updatePIISchema.parse(req.body);

    const success = await updateUserPII(userId, updateData);
    if (!success) {
      return res
        .status(500)
        .json({ error: "Failed to update user information" });
    }

    res.json({ message: "User information updated successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: "Invalid data format", details: error.errors });
    }

    logger.error("Update PII error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete user PII (GDPR compliance)
router.delete(
  "/:userId",
  requireAuth,
  requireStepUp,
  async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;

      // Users can delete their own PII or admins can delete any
      if (req.user?.user_id !== userId && !isAdmin(req.user)) {
        return res.status(403).json({ error: "Insufficient permissions" });
      }

      const success = await deleteUserPII(userId);
      if (!success) {
        return res
          .status(500)
          .json({ error: "Failed to delete user information" });
      }

      // Log the deletion for audit purposes
      logger.info(`PII deleted for user ${userId} by ${req.user?.user_id}`, {
        deleted_by: req.user?.user_id,
        target_user: userId,
        timestamp: new Date(),
        ip_address: req.ip,
      });

      res.json({ message: "User information deleted successfully" });
    } catch (error) {
      logger.error("Delete PII error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// Helper function to check if user is admin
function isAdmin(user: any): boolean {
  // Implement your admin check logic here
  // This could check against a database or user roles
  return false; // Placeholder
}

export { router as piiRouter };
