import { MongoClient, Db, ClientEncryption } from "mongodb";
import { config } from "../config/env";
import { logger } from "../config/logger";
import { getKMSCredentials } from "../encryption/kms";
import { schemaMap } from "./schemaMap";

let encryptedClient: MongoClient;
let encryptedDb: Db;
let clientEncryption: ClientEncryption;

export async function connectMongoCSFLE(): Promise<void> {
  try {
    const kmsCredentials = await getKMSCredentials();

    // Key vault namespace
    const keyVaultNamespace = `${config.MONGODB_DB_NAME}.__keyVault`;

    // Auto encryption options
    const autoEncryptionOpts = {
      keyVaultNamespace,
      kmsProviders: {
        aws: kmsCredentials,
      },
      schemaMap,
      // Bypass auto encryption for key vault operations
      bypassAutoEncryption: false,
    };

    // Create encrypted client
    encryptedClient = new MongoClient(config.MONGODB_URI, {
      autoEncryption: autoEncryptionOpts,
    });

    await encryptedClient.connect();
    encryptedDb = encryptedClient.db(config.MONGODB_DB_NAME);

    // Create ClientEncryption for manual operations
    clientEncryption = new ClientEncryption(encryptedClient, {
      keyVaultNamespace,
      kmsProviders: {
        aws: kmsCredentials,
      },
    });

    // Test the connection
    await encryptedDb.admin().ping();
    logger.info("Successfully connected to MongoDB with CSFLE");
  } catch (error) {
    logger.error("Failed to connect to MongoDB with CSFLE:", error);
    throw error;
  }
}

export function getEncryptedDb(): Db {
  if (!encryptedDb) {
    throw new Error(
      "Encrypted database not initialized. Call connectMongoCSFLE() first.",
    );
  }
  return encryptedDb;
}

export function getEncryptedClient(): MongoClient {
  if (!encryptedClient) {
    throw new Error(
      "Encrypted MongoDB client not initialized. Call connectMongoCSFLE() first.",
    );
  }
  return encryptedClient;
}

export function getClientEncryption(): ClientEncryption {
  if (!clientEncryption) {
    throw new Error(
      "ClientEncryption not initialized. Call connectMongoCSFLE() first.",
    );
  }
  return clientEncryption;
}

export async function closeMongoCSFLE(): Promise<void> {
  if (clientEncryption) {
    await clientEncryption.close();
  }
  if (encryptedClient) {
    await encryptedClient.close();
    logger.info("MongoDB CSFLE connection closed");
  }
}
