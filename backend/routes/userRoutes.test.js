const request = require("supertest");
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Mock User model
jest.mock("../models/initModels", () => ({
  User: {
    find: jest.fn(),
    findOne: jest.fn(),
  },
}));

const { User } = require("../models/initModels");

// Mock bcrypt and jwt
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

const userRoutes = require("./userRoutes");

describe("User Routes", () => {
  let app;

  beforeEach(() => {
    jest.clearAllMocks();

    app = express();
    app.use(express.json());
    app.use("/api/users", userRoutes);
  });

  describe("GET /api/users", () => {
    it("should return all users", async () => {
      const mockUsers = [{ username: "user1" }, { username: "user2" }];
      User.find.mockResolvedValue(mockUsers);

      const res = await request(app).get("/api/users");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockUsers);
      expect(User.find).toHaveBeenCalledWith({});
    });

    it("should return 400 on error", async () => {
      User.find.mockRejectedValue(new Error("DB error"));

      const res = await request(app).get("/api/users");

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "DB error");
    });
  });

  describe("POST /api/users/login", () => {
    const loginUrl = "/api/users/login";

    it("should return 400 if username and password missing", async () => {
      const res = await request(app).post(loginUrl).send({});

      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        success: false,
        message: "All fields are required.",
      });
    });

    it("should return 400 if username missing", async () => {
      const res = await request(app).post(loginUrl).send({ pwd: "pass" });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        success: false,
        message: "Missing username.",
      });
    });

    it("should return 400 if password missing", async () => {
      const res = await request(app).post(loginUrl).send({ username: "user" });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        success: false,
        message: "Missing password.",
      });
    });

    it("should return 401 if user not found", async () => {
      User.findOne.mockResolvedValue(null);

      const res = await request(app)
        .post(loginUrl)
        .send({ username: "user", pwd: "pass" });

      expect(res.status).toBe(401);
      expect(res.body).toEqual({
        success: false,
        message: "Unauthorized: User not found.",
      });
      expect(User.findOne).toHaveBeenCalledWith({ username: "user" });
    });

    it("should return 401 if password does not match", async () => {
      const fakeUser = { username: "user", password: "hashed", _id: "123" };
      User.findOne.mockResolvedValue(fakeUser);
      bcrypt.compare.mockResolvedValue(false);

      const res = await request(app)
        .post(loginUrl)
        .send({ username: "user", pwd: "wrongpass" });

      expect(res.status).toBe(401);
      expect(res.body).toEqual({
        success: false,
        message: "Unauthorized: Password does not match.",
      });
      expect(bcrypt.compare).toHaveBeenCalledWith("wrongpass", "hashed");
    });

    it("should return token and user info on successful login", async () => {
      const fakeUser = { username: "user", password: "hashed", _id: "123" };
      User.findOne.mockResolvedValue(fakeUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("fakeToken");

      const res = await request(app)
        .post(loginUrl)
        .send({ username: "user", pwd: "correctpass" });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        token: "fakeToken",
        username: "user",
        userId: "123",
      });
      expect(jwt.sign).toHaveBeenCalledWith(
        { username: "user", id: "123" },
        process.env.TOKEN_SECRET_KEY,
        { expiresIn: "1h" },
      );
    });

    it("should handle server errors gracefully", async () => {
      User.findOne.mockRejectedValue(new Error("DB failure"));

      const res = await request(app)
        .post(loginUrl)
        .send({ username: "user", pwd: "pass" });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({
        success: false,
        message: "Server error during login.",
        error: "DB failure",
      });
    });
  });

  describe("GET /api/users/:username", () => {
    it("should return user if found", async () => {
      const fakeUser = { username: "user", _id: "id123" };
      User.findOne.mockResolvedValue(fakeUser);

      const res = await request(app).get("/api/users/user");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(fakeUser);
      expect(User.findOne).toHaveBeenCalledWith({ username: "user" });
    });

    it("should return 404 if user not found", async () => {
      User.findOne.mockResolvedValue(null);

      const res = await request(app).get("/api/users/nonexistent");

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: "User not found" });
    });

    it("should return 400 on error", async () => {
      User.findOne.mockRejectedValue(new Error("DB error"));

      const res = await request(app).get("/api/users/user");

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: "DB error" });
    });
  });
});
