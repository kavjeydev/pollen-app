import * as stytch from "stytch";
import { config } from "../config/env";
import { logger } from "../config/logger";

// Initialize Stytch client
export const stytchClient = new stytch.Client({
  project_id: config.STYTCH_PROJECT_ID,
  secret: config.STYTCH_SECRET,
  env: config.NODE_ENV === "production" ? stytch.envs.live : stytch.envs.test,
});

export interface StytchUser {
  user_id: string;
  email: string;
  phone_number?: string;
  status: string;
  created_at: string;
}

export async function authenticateSession(
  sessionToken: string,
): Promise<StytchUser | null> {
  try {
    const response = await stytchClient.sessions.authenticate({
      session_token: sessionToken,
    });

    if (response.status_code === 200) {
      return {
        user_id: response.user.user_id,
        email: response.user.emails[0]?.email || "",
        phone_number: response.user.phone_numbers[0]?.phone_number,
        status: response.user.status,
        created_at: response.user.created_at,
      };
    }

    return null;
  } catch (error) {
    logger.error("Failed to authenticate session:", error);
    return null;
  }
}

export async function createMagicLink(email: string): Promise<string | null> {
  try {
    const response = await stytchClient.magicLinks.email.loginOrCreate({
      email,
      login_magic_link_url: `${config.FRONTEND_URL}/auth/callback`,
      signup_magic_link_url: `${config.FRONTEND_URL}/auth/callback`,
    });

    if (response.status_code === 200) {
      return response.user_id;
    }

    return null;
  } catch (error) {
    logger.error("Failed to create magic link:", error);
    return null;
  }
}

export async function authenticateMagicLink(token: string): Promise<{
  user: StytchUser;
  session_token: string;
} | null> {
  try {
    const response = await stytchClient.magicLinks.authenticate({
      token,
    });

    if (response.status_code === 200) {
      return {
        user: {
          user_id: response.user.user_id,
          email: response.user.emails[0]?.email || "",
          phone_number: response.user.phone_numbers[0]?.phone_number,
          status: response.user.status,
          created_at: response.user.created_at,
        },
        session_token: response.session_token,
      };
    }

    return null;
  } catch (error) {
    logger.error("Failed to authenticate magic link:", error);
    return null;
  }
}

export async function revokeSession(sessionToken: string): Promise<boolean> {
  try {
    const response = await stytchClient.sessions.revoke({
      session_token: sessionToken,
    });

    return response.status_code === 200;
  } catch (error) {
    logger.error("Failed to revoke session:", error);
    return false;
  }
}
