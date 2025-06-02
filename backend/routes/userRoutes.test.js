jest.mock("../models/initModels", () => ({
  User: {
    find: jest.fn(),
  },
}));
const request = require("supertest");
const express = require("express");
const userRouter = require("../routes/userRoutes");

process.env.MONGO_URI = "mongodb://localhost:27017/test";
require("dotenv").config();

const { User } = require("../models/initModels");
const app = express();
app.use(express.json());
app.use("/api/users", userRouter);

describe("User Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should get all users", async () => {
    const mockUsers = [
      { _id: "1", name: "John Doe", email: "john@example.com" },
      { _id: "2", name: "Jane Doe", email: "jane@example.com" },
    ];

    User.find.mockResolvedValueOnce(mockUsers);

    const response = await request(app).get("/api/users");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUsers);
    expect(User.find).toHaveBeenCalledTimes(1);
  });

  it("should return 400 if there is an error fetching users", async () => {
    User.find.mockRejectedValueOnce(new Error("Database error"));

    const response = await request(app).get("/api/users");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Database error" });
    expect(User.find).toHaveBeenCalledTimes(1);
  });
});
