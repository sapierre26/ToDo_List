const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { makeNewConnection } = require("./connection");

process.env.MONGO_URI = "mongodb://localhost:27017/test";

jest.mock("mongoose");

dotenv.config();

describe("makeNewConnection", () => {
  let mockConnection;
  let originalEnv;
  let originalExit;

  beforeAll(() => {
    originalExit = process.exit;
    process.exit = jest.fn();
    originalEnv = process.env;

    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});

    mockConnection = {
      on: jest.fn(),
      once: jest.fn(),
      close: jest.fn(),
      emit: jest.fn(),
    };
    mongoose.createConnection = jest.fn(() => mockConnection);
    mongoose.connection = { on: jest.fn(), emit: jest.fn() };
  });

  afterEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
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
    process.env.MONGO_URI = "";
    makeNewConnection();

    expect(console.error).toHaveBeenCalledWith(
      "MONGO_URI is not set in the environment variables.",
    );
    expect(process.exit).not.toHaveBeenCalledWith();
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
    jest.spyOn(console, "log").mockImplementation(() => {});
    const connection = makeNewConnection(dbUrl);
    // Mocks the 'error' event
    const testError = new Error("Test error");
    mongoose.connection.on.mock.calls.forEach((call) => {
      if (call[0] === "error") call[1](testError);
    });

    expect(console.log).toHaveBeenCalledWith(testError);
  });
});
