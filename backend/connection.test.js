const mongoose = require("mongoose");
const { makeNewConnection } = require("./connection");

describe("makeNewConnection", () => {
  let mockConnection;
  let originalEnv;
  let originalExit;

  beforeAll(() => {
    originalEnv = { ...process.env };
    originalExit = process.exit;

    mockConnection = {
      on: jest.fn(),
      once: jest.fn(),
      close: jest.fn(),
    };

    mongoose.createConnection = jest.fn().mockReturnValue(mockConnection);
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
    process.exit = jest.fn();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
    process.exit = originalExit;
    jest.restoreAllMocks();
  });

  describe("successful connections", () => {
    it("should create a connection with correct options", () => {
      const url = "mongodb://localhost:27017/testDB";
      const conn = makeNewConnection(url);

      expect(mongoose.createConnection).toHaveBeenCalledWith(url, {
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
      });
      expect(conn).toBe(mockConnection);
    });
  });

  describe("error handling", () => {
    it("should throw error in test environment when URL is missing", () => {
      process.env.NODE_ENV = "test";
      expect(() => makeNewConnection()).toThrow(
        "MONGO_URI must be provided in test environment",
      );
    });

    it("should exit process in non-test environment when URL is missing", () => {
      process.env.NODE_ENV = "development";
      // Mock URL validation to pass
      jest.spyOn(String.prototype, "startsWith").mockReturnValue(true);

      makeNewConnection();

      expect(console.error).toHaveBeenCalledWith(
        "MONGO_URI is not set in the environment variables.",
      );
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });
});
