#!/usr/bin/env node

/**
 * One-time script to create data encryption key in MongoDB key vault
 * Run this script once during initial setup:
 * npx ts-node src/encryption/keyvault-init.ts
 */

import { MongoClient, ClientEncryption } from "mongodb";
import { config } from "../config/env";
import { getKMSCredentials } from "./kms";
import { logger } from "../config/logger";

async function initializeKeyVault() {
  let client: MongoClient | null = null;
  let clientEncryption: ClientEncryption | null = null;

  try {
    logger.info("Initializing key vault...");

    // Connect to MongoDB without auto-encryption for key vault setup
    client = new MongoClient(config.MONGODB_URI);
    await client.connect();

    const keyVaultNamespace = `${config.MONGODB_DB_NAME}.__keyVault`;
    const kmsCredentials = await getKMSCredentials();

    // Create ClientEncryption for key management
    clientEncryption = new ClientEncryption(client, {
      keyVaultNamespace,
      kmsProviders: {
        aws: kmsCredentials,
      },
    });

    // Create data key for PII encryption
    const dataKeyId = await clientEncryption.createDataKey("aws", {
      masterKey: {
        key: config.AWS_KMS_KEY_ID,
        region: config.AWS_REGION,
      },
      keyAltNames: ["pii-data-key"],
    });

    logger.info("Data key created successfully!");
    logger.info(`Data Key ID: ${dataKeyId.toString("base64")}`);
    logger.info("");
    logger.info("IMPORTANT: Update schemaMap.ts with this Data Key ID");
    logger.info(
      `Replace 'DATA_KEY_ID_PLACEHOLDER' with: ${dataKeyId.toString("base64")}`,
    );

    // Create unique index on key vault collection for performance
    const keyVaultColl = client
      .db(config.MONGODB_DB_NAME)
      .collection("__keyVault");
    await keyVaultColl.createIndex(
      { keyAltNames: 1 },
      {
        unique: true,
        partialFilterExpression: { keyAltNames: { $exists: true } },
      },
    );

    logger.info("Key vault initialization completed successfully!");
  } catch (error) {
    logger.error("Failed to initialize key vault:", error);
    process.exit(1);
  } finally {
    if (clientEncryption) {
      await clientEncryption.close();
    }
    if (client) {
      await client.close();
    }
  }
}

// Run the initialization if this file is executed directly
if (require.main === module) {
  initializeKeyVault()
    .then(() => process.exit(0))
    .catch((error) => {
      logger.error("Key vault initialization failed:", error);
      process.exit(1);
    });
}

export { initializeKeyVault };
