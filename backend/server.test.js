jest.setTimeout(30000);

jest.mock("./connection", () => ({
  makeNewConnection: jest.fn().mockReturnValue({
    on: jest.fn(),
    once: jest.fn(),
    close: jest.fn(),
    model: jest.fn().mockImplementation((modelName, schema) => ({
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
    })),
  }),
}));

const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let app;
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  process.env.MONGO_URI = uri;
  process.env.NODE_ENV = "test";
  process.env.TOKEN_SECRET_KEY = "test-secret";

  await mongoose.connect(uri);

  // Require app AFTER mocking and setting env variables
  app = require("./server");
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  jest.restoreAllMocks();
});

describe("Express App", () => {
  it("should return a 200 status for the root endpoint", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toBe("To-Do List Root");
  });

  // it("should respond to CORS headers correctly", async () => {
  //   const response = await request(app).options("/");
  //   expect(response.headers["access-control-allow-origin"]).toBe(
  //     "http://localhost:5173",
  //   );

  //   const allowMethods = response.headers["access-control-allow-methods"];
  //   expect(allowMethods).toEqual(expect.stringContaining("GET"));
  //   expect(allowMethods).toEqual(expect.stringContaining("POST"));
  //   expect(allowMethods).toEqual(expect.stringContaining("PUT"));
  //   expect(allowMethods).toEqual(expect.stringContaining("DELETE"));
  //   expect(response.status).toBe(204);
  // });

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
