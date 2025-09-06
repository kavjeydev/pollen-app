// Test setup file
import { config } from "../src/config/env";

// Mock environment variables for testing
process.env.NODE_ENV = "test";
process.env.MONGODB_URI = "mongodb://localhost:27017/paypollen_test";
process.env.JWT_SECRET = "test-jwt-secret";
process.env.STYTCH_PROJECT_ID = "test-project-id";
process.env.STYTCH_SECRET = "test-secret";
process.env.PLAID_CLIENT_ID = "test-client-id";
process.env.PLAID_SECRET = "test-secret";
process.env.AWS_KMS_KEY_ID = "test-key-id";
process.env.AWS_ACCESS_KEY_ID = "test-access-key";
process.env.AWS_SECRET_ACCESS_KEY = "test-secret-key";
process.env.TURNSTILE_SECRET_KEY = "test-turnstile-secret";

// Mock external services
jest.mock("../src/auth/stytch", () => ({
  authenticateSession: jest.fn(),
  createMagicLink: jest.fn(),
  authenticateMagicLink: jest.fn(),
  revokeSession: jest.fn(),
}));

jest.mock("../src/kyc/plaid", () => ({
  createIDVSession: jest.fn(),
  getIDVStatus: jest.fn(),
  retryIDVSession: jest.fn(),
}));

jest.mock("../src/db/mongo", () => ({
  connectMongo: jest.fn(),
  getDb: jest.fn(() => ({
    collection: jest.fn(() => ({
      findOne: jest.fn(),
      insertOne: jest.fn(),
      updateOne: jest.fn(),
      deleteOne: jest.fn(),
    })),
  })),
  closeMongo: jest.fn(),
}));

// Global test teardown
afterAll(async () => {
  // Close any open connections, cleanup, etc.
});
