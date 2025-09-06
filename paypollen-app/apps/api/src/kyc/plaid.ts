import {
  PlaidApi,
  Configuration,
  PlaidEnvironments,
  IdentityVerificationCreateRequest,
} from "plaid";
import { config } from "../config/env";
import { logger } from "../config/logger";

// Initialize Plaid client
const configuration = new Configuration({
  basePath: PlaidEnvironments[config.PLAID_ENV],
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": config.PLAID_CLIENT_ID,
      "PLAID-SECRET": config.PLAID_SECRET,
    },
  },
});

export const plaidClient = new PlaidApi(configuration);

export interface IDVSessionData {
  user_id: string;
  template: string;
  gave_consent: boolean;
  is_shareable: boolean;
}

export async function createIDVSession(userId: string): Promise<string | null> {
  try {
    const request: IdentityVerificationCreateRequest = {
      is_shareable: true,
      template_id: "idvtmp_4FrXJvfQU3zGUR", // Use your Plaid template ID
      gave_consent: true,
      user: {
        client_user_id: userId,
        phone_number: undefined, // Will be collected during IDV
        email_address: undefined, // Will be collected during IDV
      },
    };

    const response = await plaidClient.identityVerificationCreate(request);

    if (response.data.shareable_url) {
      logger.info(`IDV session created for user ${userId}`);
      return response.data.shareable_url;
    }

    return null;
  } catch (error) {
    logger.error("Failed to create IDV session:", error);
    return null;
  }
}

export async function getIDVStatus(idvId: string): Promise<any> {
  try {
    const response = await plaidClient.identityVerificationGet({
      identity_verification_id: idvId,
    });

    return {
      id: response.data.id,
      status: response.data.status,
      steps: response.data.steps,
      documentary_verification: response.data.documentary_verification,
      selfie_verification: response.data.selfie_verification,
      kyc_check: response.data.kyc_check,
      risk_check: response.data.risk_check,
      shareable_url: response.data.shareable_url,
    };
  } catch (error) {
    logger.error("Failed to get IDV status:", error);
    return null;
  }
}

export async function retryIDVSession(idvId: string): Promise<string | null> {
  try {
    const response = await plaidClient.identityVerificationRetry({
      identity_verification_id: idvId,
      steps: {
        verify_sms: true,
        kyc_check: true,
        documentary_verification: true,
        selfie_check: true,
      },
    });

    if (response.data.shareable_url) {
      return response.data.shareable_url;
    }

    return null;
  } catch (error) {
    logger.error("Failed to retry IDV session:", error);
    return null;
  }
}
