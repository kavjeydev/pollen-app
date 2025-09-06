import { MongoClient, Db } from "mongodb";
import { config } from "../config/env";
import { logger } from "../config/logger";

let client: MongoClient;
let db: Db;

export async function connectMongo(): Promise<void> {
  try {
    client = new MongoClient(config.MONGODB_URI);
    await client.connect();
    db = client.db(config.MONGODB_DB_NAME);

    // Test the connection
    await db.admin().ping();
    logger.info("Successfully connected to MongoDB (basic client)");
  } catch (error) {
    logger.error("Failed to connect to MongoDB:", error);
    throw error;
  }
}

export function getDb(): Db {
  if (!db) {
    throw new Error("Database not initialized. Call connectMongo() first.");
  }
  return db;
}

export function getClient(): MongoClient {
  if (!client) {
    throw new Error(
      "MongoDB client not initialized. Call connectMongo() first.",
    );
  }
  return client;
}

export async function closeMongo(): Promise<void> {
  if (client) {
    await client.close();
    logger.info("MongoDB connection closed");
  }
}
