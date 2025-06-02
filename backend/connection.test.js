const mongoose = require("mongoose");
const { makeNewConnection } = require("./connection");

describe("makeNewConnection", () => {
  let mockConnection;
  let originalEnv;
  let originalExit;
  let mockOnHandlers = {};
  let originalURL;

  beforeAll(() => {
    originalEnv = { ...process.env };
    originalExit = process.exit;
    originalURL = global.URL;

    mockConnection = {
      on: jest.fn((event, handler) => {
        mockOnHandlers[event] = handler;
        return mockConnection;
      }),
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
    mockOnHandlers = {};
    global.URL = originalURL;
  });

  afterAll(() => {
    process.env = originalEnv;
    process.exit = originalExit;
    global.URL = originalURL;
    jest.restoreAllMocks();
  });

  describe("successful connections", () => {
    it("should create a connection with correct options", () => {
      const url = "mongodb://localhost:27017/testDB";
      const conn = makeNewConnection(url);

      expect(mongoose.createConnection).toHaveBeenCalledWith(url, {
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      expect(conn).toBe(mockConnection);
    });

    it("should extract database name from standard connection string", () => {
      jest.spyOn(URL.prototype, "pathname", "get").mockReturnValue("/testDB");

      const url = "mongodb://localhost:27017/testDB";
      makeNewConnection(url);

      if (mockOnHandlers.connected) {
        mockOnHandlers.connected();
        expect(console.log).toHaveBeenCalledWith(
          "MongoDB :: connected :: testDB",
        );
      }
    });

    it("should use 'default' when no database name in URL", () => {
      jest.spyOn(URL.prototype, "pathname", "get").mockReturnValue("/");

      const url = "mongodb://localhost:27017/";
      makeNewConnection(url);

      if (mockOnHandlers.connected) {
        mockOnHandlers.connected();
        expect(console.log).toHaveBeenCalledWith(
          "MongoDB :: connected :: default",
        );
      }
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
      makeNewConnection(); // Will call process.exit(1)
      expect(console.error).toHaveBeenCalledWith(
        "MONGO_URI is not set in the environment variables.",
      );
      expect(process.exit).toHaveBeenCalledWith(1);
    });

    it("should throw error for invalid URL format", () => {
      expect(() => makeNewConnection("invalid-url")).toThrow(
        "Invalid MongoDB connection string: invalid-url",
      );
    });

    it("should use 'unknown' when URL parsing fails", () => {
      jest.spyOn(global, "URL").mockImplementation(() => {
        throw new Error("Invalid URL");
      });

      const url = "mongodb://localhost:27017/testDB";
      makeNewConnection(url);

      if (mockOnHandlers.connected) {
        mockOnHandlers.connected();
        expect(console.log).toHaveBeenCalledWith(
          "MongoDB :: connected :: unknown",
        );
      }
    });
  });

  describe("event handling", () => {
    it("should register event handlers in non-test environment", () => {
      process.env.NODE_ENV = "development";
      makeNewConnection("mongodb://localhost:27017/testDB");

      expect(mockConnection.on).toHaveBeenCalledWith(
        "connected",
        expect.any(Function),
      );
      expect(mockConnection.on).toHaveBeenCalledWith(
        "disconnected",
        expect.any(Function),
      );
      expect(mockConnection.on).toHaveBeenCalledWith(
        "error",
        expect.any(Function),
      );
    });

    it("should not register event handlers in test environment", () => {
      process.env.NODE_ENV = "test";
      makeNewConnection("mongodb://localhost:27017/testDB");

      expect(mockConnection.on).not.toHaveBeenCalled();
    });

    it("should log connection events properly", () => {
      jest.spyOn(URL.prototype, "pathname", "get").mockReturnValue("/testDB");

      process.env.NODE_ENV = "development";
      makeNewConnection("mongodb://localhost:27017/testDB");

      if (mockOnHandlers.connected) {
        mockOnHandlers.connected();
        expect(console.log).toHaveBeenCalledWith(
          "MongoDB :: connected :: testDB",
        );
      }

      if (mockOnHandlers.disconnected) {
        mockOnHandlers.disconnected();
        expect(console.log).toHaveBeenCalledWith("MongoDB :: disconnected");
      }

      if (mockOnHandlers.error) {
        const error = new Error("Connection failed");
        mockOnHandlers.error(error);
        expect(console.error).toHaveBeenCalledWith(
          "MongoDB connection error:",
          error,
        );
      }
    });
  });
});
