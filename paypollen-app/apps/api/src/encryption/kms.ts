import AWS from "aws-sdk";
import { config } from "../config/env";
import { logger } from "../config/logger";

// Configure AWS SDK
AWS.config.update({
  region: config.AWS_REGION,
  accessKeyId: config.AWS_ACCESS_KEY_ID,
  secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
});

const kms = new AWS.KMS();

export interface KMSCredentials {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken?: string;
}

export async function getKMSCredentials(): Promise<KMSCredentials> {
  try {
    // In production, you might want to use IAM roles for service accounts (IRSA)
    // For now, using direct credentials from env
    return {
      accessKeyId: config.AWS_ACCESS_KEY_ID,
      secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
    };
  } catch (error) {
    logger.error("Failed to get KMS credentials:", error);
    throw error;
  }
}

export async function createDataKey(): Promise<string> {
  try {
    const params = {
      KeyId: config.AWS_KMS_KEY_ID,
      KeySpec: "AES_256",
    };

    const result = await kms.generateDataKey(params).promise();
    if (!result.CiphertextBlob) {
      throw new Error("Failed to generate data key");
    }

    // Return base64 encoded data key
    return result.CiphertextBlob.toString("base64");
  } catch (error) {
    logger.error("Failed to create data key:", error);
    throw error;
  }
}

export { kms };
