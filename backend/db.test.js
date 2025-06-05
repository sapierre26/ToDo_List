const mongoose = require("mongoose");
const connectDB = require("./db");

// Mock mongoose and console
jest.mock("mongoose");
jest.spyOn(console, "log").mockImplementation(() => {});
jest.spyOn(console, "error").mockImplementation(() => {});

describe("connectDB", () => {
  let originalEnv;

  beforeAll(() => {
    originalEnv = { ...process.env };
  });

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
    jest.restoreAllMocks();
  });

  describe("in test environment", () => {
    it("should do nothing when NODE_ENV is test", async () => {
      process.env.NODE_ENV = "test";
      delete process.env.MONGO_URI; // Ensure it would fail if it tried to connect

      await connectDB();

      expect(mongoose.connect).not.toHaveBeenCalled();
      expect(console.log).not.toHaveBeenCalled();
    });
  });

  describe("in non-test environments", () => {
    beforeEach(() => {
      process.env.NODE_ENV = "development";
      process.env.MONGO_URI = "mongodb://localhost:27017/mydb";
    });

    it("should connect to MongoDB with correct URI", async () => {
      mongoose.connect.mockResolvedValueOnce();

      await connectDB();

      expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGO_URI);
      expect(console.log).toHaveBeenCalledWith("MongoDB connected.");
    });

    it("should handle connection errors", async () => {
      const mockError = new Error("Connection failed");
      mongoose.connect.mockRejectedValueOnce(mockError);

      await connectDB();

      expect(mongoose.connect).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith(mockError.message);
      expect(console.log).not.toHaveBeenCalledWith("MongoDB connected.");
    });

    it("should throw error if MONGO_URI is missing", async () => {
      delete process.env.MONGO_URI;

      await connectDB();

      expect(mongoose.connect).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining("MongoDB connection error"),
      );
    });
  });
});
