import { getEncryptedDb } from "../db/mongo-csfle";
import { logger } from "../config/logger";

export interface UserPII {
  stytch_user_id: string;
  email: string;
  phone?: string;
  ssn?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  created_at: Date;
  updated_at: Date;
}

export async function insertUserPII(
  piiData: Omit<UserPII, "created_at" | "updated_at">,
): Promise<boolean> {
  try {
    const db = getEncryptedDb();

    const document: UserPII = {
      ...piiData,
      created_at: new Date(),
      updated_at: new Date(),
    };

    // Insert into encrypted collection
    const result = await db.collection("users").insertOne(document);

    if (result.insertedId) {
      logger.info(
        `User PII inserted successfully for user: ${piiData.stytch_user_id}`,
      );
      return true;
    }

    return false;
  } catch (error) {
    logger.error("Failed to insert user PII:", error);
    return false;
  }
}

export async function updateUserPII(
  stytchUserId: string,
  updateData: Partial<
    Omit<UserPII, "stytch_user_id" | "created_at" | "updated_at">
  >,
): Promise<boolean> {
  try {
    const db = getEncryptedDb();

    const result = await db.collection("users").updateOne(
      { stytch_user_id: stytchUserId },
      {
        $set: {
          ...updateData,
          updated_at: new Date(),
        },
      },
    );

    if (result.modifiedCount > 0) {
      logger.info(`User PII updated successfully for user: ${stytchUserId}`);
      return true;
    }

    return false;
  } catch (error) {
    logger.error("Failed to update user PII:", error);
    return false;
  }
}

export async function getUserPII(
  stytchUserId: string,
): Promise<UserPII | null> {
  try {
    const db = getEncryptedDb();

    const user = await db.collection("users").findOne({
      stytch_user_id: stytchUserId,
    });

    return user as UserPII | null;
  } catch (error) {
    logger.error("Failed to get user PII:", error);
    return null;
  }
}

export async function deleteUserPII(stytchUserId: string): Promise<boolean> {
  try {
    const db = getEncryptedDb();

    const result = await db.collection("users").deleteOne({
      stytch_user_id: stytchUserId,
    });

    if (result.deletedCount > 0) {
      logger.info(`User PII deleted successfully for user: ${stytchUserId}`);
      return true;
    }

    return false;
  } catch (error) {
    logger.error("Failed to delete user PII:", error);
    return false;
  }
}
