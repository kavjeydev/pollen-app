import { Router, Request, Response } from "express";
import { z } from "zod";
import {
  createMagicLink,
  authenticateMagicLink,
  revokeSession,
} from "./stytch";
import { requireAuth } from "./middleware";
import { logger } from "../config/logger";

const router = Router();

// Login/signup with magic link
const loginSchema = z.object({
  email: z.string().email(),
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email } = loginSchema.parse(req.body);

    const userId = await createMagicLink(email);
    if (!userId) {
      return res.status(400).json({ error: "Failed to send magic link" });
    }

    res.json({
      message: "Magic link sent successfully",
      user_id: userId,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    logger.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Authenticate magic link callback
const callbackSchema = z.object({
  token: z.string(),
});

router.post("/callback", async (req: Request, res: Response) => {
  try {
    const { token } = callbackSchema.parse(req.body);

    const result = await authenticateMagicLink(token);
    if (!result) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    res.json({
      message: "Authentication successful",
      user: result.user,
      session_token: result.session_token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid token format" });
    }

    logger.error("Callback error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Logout
router.post("/logout", requireAuth, async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(400).json({ error: "No session to logout" });
    }

    const sessionToken = authHeader.substring(7);
    const success = await revokeSession(sessionToken);

    if (!success) {
      return res.status(400).json({ error: "Failed to logout" });
    }

    res.json({ message: "Logout successful" });
  } catch (error) {
    logger.error("Logout error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get current user
router.get("/me", requireAuth, (req: Request, res: Response) => {
  res.json({ user: req.user });
});

export { router as authRouter };
