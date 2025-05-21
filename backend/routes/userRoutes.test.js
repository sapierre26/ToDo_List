const request = require("supertest");
const express = require("express");
const userRouter = require("../routes/userRoutes"); // Adjust path accordingly
const User = require("../models/userSchema");
process.env.MONGO_URI = "mongodb://localhost:27017/test";

// Mock User model
jest.mock("../models/userSchema");

const app = express();
app.use(express.json());
app.use("/api/users", userRouter);

describe("User Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test GET all users
  it("should get all users", async () => {
    const mockUsers = [
      { _id: "1", name: "John Doe", email: "john@example.com" },
      { _id: "2", name: "Jane Doe", email: "jane@example.com" },
    ];

    // Mock the User.find method to return the mock users
    User.find.mockResolvedValueOnce(mockUsers);

    const response = await request(app).get("/api/users");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUsers);
    expect(User.find).toHaveBeenCalledTimes(1); // Ensure User.find was called once
  });

  // Test for error when fetching users (e.g., database error)
  it("should return 400 if there is an error fetching users", async () => {
    // Mock User.find to throw an error
    User.find.mockRejectedValueOnce(new Error("Database error"));

    const response = await request(app).get("/api/users");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Database error" });
    expect(User.find).toHaveBeenCalledTimes(1); // Ensure User.find was called once
  });
});
