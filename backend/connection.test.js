jest.setTimeout(15000); // 15 seconds

const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { makeNewConnection } = require("./connection");
process.env.MONGO_URI = "mongodb://localhost:27017/test";

jest.mock("mongoose");

dotenv.config();

describe("makeNewConnection", () => {
  let mockConnection;
  let originalExit;

  beforeAll(() => {
    mockConnection = {
      on: jest.fn(),
      once: jest.fn(),
      close: jest.fn(),
      emit: jest.fn(),
    };

    mongoose.createConnection = jest.fn().mockReturnValue(mockConnection);

    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
    originalExit = process.exit;
    process.exit = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
    process.exit = originalExit;
  });

  afterAll(() => {
    process.exit = originalExit;
  });

  it("should create a new connection with the correct URL", () => {
    const dbUrl = "mongodb://localhost:27017/testDB";
    const connection = makeNewConnection(dbUrl); // Calls the function with a fake URL
    expect(mongoose.createConnection).toHaveBeenCalledWith(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    expect(connection).toBe(mockConnection);
  });

  it("should log an error and terminate if MONGO_URI is not set", () => {
    const originalExit = process.exit; // Preserve original process.exit
    const originalEnv = process.env.NODE_ENV;

    process.exit = jest.fn(); // Mock exit function
    process.env.NODE_ENV = "development";

    // Call with no URL
    process.env.MONGO_URI = "";
    makeNewConnection();

    expect(console.error).toHaveBeenCalledWith(
      "MONGO_URI is not set in the environment variables.",
    );
    expect(process.exit).toHaveBeenCalledWith(1); // Ensure the process exits

    process.exit = originalExit; // Restore process.exit after the test
    process.env.NODE_ENV = originalEnv;
  });

  it("should log the connection success message", () => {
    process.env.NODE_ENV = "development";

    const dbUrl = "mongodb://localhost:27017/testDB";
    const connection = makeNewConnection(dbUrl);
    // Mocks the 'connected' event
    connection.on.mock.calls.forEach((call) => {
      if (call[0] === "connected") call[1]();
    });

    expect(console.log).toHaveBeenCalledWith("MongoDB :: connected :: testDB");
  });

  it("should log the disconnection message", () => {
    process.env.NODE_ENV = "development";
    const dbUrl = "mongodb://localhost:27017/testDB";
    const connection = makeNewConnection(dbUrl);
    // Mocks the 'disconnected' event
    connection.on.mock.calls.forEach((call) => {
      if (call[0] === "disconnected") call[1]();
    });

    expect(console.log).toHaveBeenCalledWith("MongoDB :: disconnected");
  });

  it("should handle mongoose errors", () => {
    process.env.NODE_ENV = "development";
    const dbUrl = "mongodb://localhost:27017/testDB";
    const connection = makeNewConnection(dbUrl);
    // Mocks the 'error' event
    const testError = new Error("Test error");
    connection.on.mock.calls.forEach((call) => {
      if (call[0] === "error") call[1](testError);
    });

    expect(console.error).toHaveBeenCalledWith(
      "MongoDB connection error:",
      testError,
    );
  });
});
