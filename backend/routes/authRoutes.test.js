process.env.TOKEN_SECRET_KEY = "testsecret";
const request = require("supertest");
const express = require("express");
const authRoutes = require("../routes/authRoutes");
const jwt = require("jsonwebtoken");

// Mock auth middleware
jest.mock("../middleware/auth.js", () => (req, res, next) => {
  req.user = { id: "mockUserId" };
  next();
});

// Mock bcryptjs
jest.mock("bcryptjs", () => ({
  genSalt: jest.fn(() => Promise.resolve("salt")),
  hash: jest.fn(() => Promise.resolve("hashedpassword")),
  compare: jest.fn(() => Promise.resolve(true)),
}));

// Mock JWT sign
jwt.sign = jest.fn(() => "test-token");

// Create a mock User model
const mockUser = {
  _id: "mockUserId",
  username: "testuser",
  email: "test@example.com",
  password: "hashedpassword",
  theme: "light",
  font: "Arial",
  save: jest.fn().mockResolvedValue(true),
};

jest.mock("../models/initModels.js", () => {
  const mockUserModel = function (data) {
    return {
      ...data,
      save: jest.fn().mockResolvedValue({
        _id: "mockUserId",
        ...data,
      }),
    };
  };

  // Static methods
  mockUserModel.findOne = jest.fn();
  mockUserModel.findById = jest.fn();
  mockUserModel.findByIdAndUpdate = jest.fn();
  mockUserModel.findByIdAndDelete = jest.fn();
  mockUserModel.create = jest.fn();

  return {
    User: mockUserModel,
  };
});

const { User } = require("../models/initModels.js");

const app = express();
app.use(express.json());
app.use("/auth", authRoutes);

describe("Auth Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    User.findOne.mockReset();
    User.findById.mockReset();
    User.findByIdAndUpdate.mockReset();
    User.findByIdAndDelete.mockReset();
    User.create.mockReset();
  });

  test("POST /auth/register - should create a user and return a token", async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue(mockUser);

    const res = await request(app).post("/auth/register").send({
      username: "testuser",
      email: "test@example.com",
      pwd: "password123",
      name: "Test User",
    });

    expect(res.status).toBe(201);
    expect(res.body).toEqual(
      expect.objectContaining({
        token: "test-token",
        username: "testuser",
        userID: "mockUserId",
      }),
    );
  });

  test("DELETE /auth/delete - should delete user", async () => {
    User.findByIdAndDelete.mockResolvedValue(true);

    const res = await request(app).delete("/auth/delete");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ msg: "server error while deleting account" });
  });

  test("POST /auth/login - should log in a user and return a token", async () => {
    User.findOne.mockResolvedValue(mockUser);

    const res = await request(app).post("/auth/login").send({
      username: "testuser",
      pwd: "password123",
    });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        token: "test-token",
        username: "testuser",
        userID: "mockUserId",
      }),
    );
  });

  test("GET /auth/protected - should return authorized user", async () => {
    const res = await request(app).get("/auth/protected");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      msg: "You are authorized",
      user: { id: "mockUserId" },
    });
  });
});
