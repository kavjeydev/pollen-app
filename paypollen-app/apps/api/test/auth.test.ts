import request from "supertest";
import { app } from "../src/index";

describe("Authentication Endpoints", () => {
  describe("POST /api/auth/login", () => {
    it("should send magic link for valid email", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: "test@example.com" });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message");
      expect(response.body).toHaveProperty("user_id");
    });

    it("should reject invalid email format", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: "invalid-email" });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });

    it("should reject missing email", async () => {
      const response = await request(app).post("/api/auth/login").send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("POST /api/auth/callback", () => {
    it("should reject invalid token", async () => {
      const response = await request(app)
        .post("/api/auth/callback")
        .send({ token: "invalid-token" });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });

    it("should reject missing token", async () => {
      const response = await request(app).post("/api/auth/callback").send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("GET /api/auth/me", () => {
    it("should reject requests without auth header", async () => {
      const response = await request(app).get("/api/auth/me");

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error");
    });

    it("should reject invalid auth header", async () => {
      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Bearer invalid-token");

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("POST /api/auth/logout", () => {
    it("should reject requests without auth header", async () => {
      const response = await request(app).post("/api/auth/logout");

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error");
    });
  });
});
