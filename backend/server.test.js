const request = require("supertest");
const mongoose = require("mongoose");
process.env.tasksDB = "mongodb://localhost:27017/testTasks";
process.env.userDB = "mongodb://localhost:27017/testUsers";
process.env.MONGO_URI = "mongodb://localhost:27017/test";
require("dotenv").config();

const app = require("./server.js");

describe("Express App", () => {
  it("should return a 200 status for the root endpoint", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toBe("To-Do List Root");
  });

  it("should respond to CORS headers correctly", async () => {
    const response = await request(app).get("/api/Users");
    expect(response.header["access-control-allow-origin"]).toBe(
      "http://localhost:5173",
    );
    expect(response.header["access-control-allow-methods"]).toBe(
      "GET, POST, OPTIONS, DELETE, PUT",
    );
    expect(response.status).toBe(200);
  });

  it("should log the correct request method and path using loggerMiddleware", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    await request(app).get("/api/Users");
    expect(consoleSpy).toHaveBeenCalledWith("GET /api/Users");
    consoleSpy.mockRestore();
  });

  it("should return 404 for an unknown route", async () => {
    const response = await request(app).get("/unknown-route");
    expect(response.status).toBe(404);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });
});
