import { z } from "zod";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().transform(Number).default("3001"),

  // Database
  MONGODB_URI: z.string(),
  MONGODB_DB_NAME: z.string().default("paypollen"),

  // AWS KMS for encryption
  AWS_REGION: z.string().default("us-east-1"),
  AWS_KMS_KEY_ID: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),

  // Stytch Authentication
  STYTCH_PROJECT_ID: z.string(),
  STYTCH_SECRET: z.string(),
  STYTCH_PUBLIC_TOKEN: z.string(),

  // Plaid KYC
  PLAID_CLIENT_ID: z.string(),
  PLAID_SECRET: z.string(),
  PLAID_ENV: z
    .enum(["sandbox", "development", "production"])
    .default("sandbox"),

  // Security
  JWT_SECRET: z.string(),
  TURNSTILE_SECRET_KEY: z.string(),

  // CORS
  CORS_ORIGINS: z.string().default("http://localhost:3000"),

  // Frontend URLs
  FRONTEND_URL: z.string().default("http://localhost:3000"),
  API_URL: z.string().default("http://localhost:3001"),
});

export const config = envSchema.parse(process.env);
