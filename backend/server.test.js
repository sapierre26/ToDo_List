jest.setTimeout(20000);
const request = require("supertest");
const mongoose = require("mongoose");

process.env.tasksDB = "mongodb://localhost:27017/testTasks";
process.env.userDB = "mongodb://localhost:27017/testUsers";
process.env.MONGO_URI = "mongodb://localhost:27017/test";

const app = require("./server");

describe("Express App", () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI);
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should return a 200 status for the root endpoint", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.text).toBe("To-Do List Root");
  });

  it("should respond to CORS headers correctly", async () => {
    const res = await request(app)
      .options("/api/Users")
      .set("Origin", "http://localhost:5173")
      .set("Access-Control-Request-Method", "GET");

    expect(res.header["access-control-allow-origin"]).toBe("http://localhost:5173");
    expect(res.header["access-control-allow-methods"]).toMatch(/GET|POST|OPTIONS|DELETE|PUT/);
    expect(res.status).toBe(204);
  });

  it("should log the correct request method and path using loggerMiddleware", async () => {
    const spy = jest.spyOn(console, "log").mockImplementation(() => {});
    await request(app).get("/api/Users");
    expect(spy).toHaveBeenCalledWith("GET /api/Users");
    spy.mockRestore();
  });

  it("should return 404 for an unknown route", async () => {
    const res = await request(app).get("/unknown-route");
    expect(res.status).toBe(404);
  });
});
