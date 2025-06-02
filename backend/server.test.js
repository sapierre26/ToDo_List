jest.setTimeout(30000);

const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let app;
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  process.env.MONGO_URI = uri;

  await mongoose.connect(uri);

  app = require("./server");
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Express App", () => {
  it("should return a 200 status for the root endpoint", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toBe("To-Do List Root");
  });

  it("should respond to CORS headers correctly", async () => {
    const response = await request(app).get("/api/users");
    expect(response.headers["access-control-allow-origin"]).toBe(
      "http://localhost:5173",
    );
    expect(response.headers["access-control-allow-methods"]).toBe(
      "GET, POST, OPTIONS, DELETE, PUT",
    );
    expect(response.status).toBe(200);
  });

  it("should log the correct request method and path", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    await request(app).get("/api/users");
    expect(consoleSpy).toHaveBeenCalledWith("GET /api/users");
    consoleSpy.mockRestore();
  });

  it("should return 404 for an unknown route", async () => {
    const response = await request(app).get("/unknown-route");
    expect(response.status).toBe(404);
  });
});
