const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { makeNewConnection } = require("./connection");
<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
=======

>>>>>>> refs/remotes/origin/main
=======

>>>>>>> refs/remotes/origin/main
>>>>>>> 9e20c74 (Error Fixing)
process.env.MONGO_URI = "mongodb://localhost:27017/test";

jest.mock("mongoose");
jest.mock("mongoose");

dotenv.config();

describe("makeNewConnection", () => {
  let mockConnection;
  let originalEnv;
  let originalExit;

  beforeAll(() => {
    mockConnection = {
      on: jest.fn(),
      once: jest.fn(),
      close: jest.fn(),
      emit: jest.fn(),
    };
<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> 9e20c74 (Error Fixing)
    mongoose.createConnection = jest.fn().mockReturnValue(mockConnection);
    mongoose.connection = { on: jest.fn(), emit: jest.fn() };

    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
    originalExit = process.exit();
    process.exit = jest.fn();
    originalEnv = process.env;
<<<<<<< HEAD
=======
=======
    mongoose.createConnection = jest.fn(() => mockConnection);
    mongoose.connection = { on: jest.fn(), emit: jest.fn() };
>>>>>>> refs/remotes/origin/main
=======
    mongoose.createConnection = jest.fn(() => mockConnection);
    mongoose.connection = { on: jest.fn(), emit: jest.fn() };
>>>>>>> refs/remotes/origin/main
>>>>>>> 9e20c74 (Error Fixing)
  });

  afterEach(() => {
    jest.clearAllMocks();
<<<<<<< HEAD
    process.exit = originalExit;
    process.env = originalEnv;
=======
<<<<<<< HEAD
<<<<<<< HEAD
    process.exit = originalExit;
    process.env = originalEnv;
=======
=======
>>>>>>> refs/remotes/origin/main
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.exit = originalExit;
<<<<<<< HEAD
>>>>>>> refs/remotes/origin/main
=======
>>>>>>> refs/remotes/origin/main
>>>>>>> 9e20c74 (Error Fixing)
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
<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> 9e20c74 (Error Fixing)
    const originalExit = process.exit; // Preserve original process.exit
    const originalEnv = process.env.NODE_ENV;

    process.exit = jest.fn(); // Mock exit function
    process.env.NODE_ENV = "development";

    // Call with no URL
<<<<<<< HEAD
=======
=======
    process.env.MONGO_URI = "";
>>>>>>> refs/remotes/origin/main
=======
    process.env.MONGO_URI = "";
>>>>>>> refs/remotes/origin/main
>>>>>>> 9e20c74 (Error Fixing)
    makeNewConnection();

    expect(console.error).toHaveBeenCalledWith(
      "MONGO_URI is not set in the environment variables.",
    );
<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> 9e20c74 (Error Fixing)
    expect(process.exit).toHaveBeenCalledWith(1); // Ensure the process exits

    process.exit = originalExit; // Restore process.exit after the test
    process.env.NODE_ENV = originalEnv;
<<<<<<< HEAD
=======
=======
    expect(process.exit).not.toHaveBeenCalledWith();
>>>>>>> refs/remotes/origin/main
=======
    expect(process.exit).not.toHaveBeenCalledWith();
>>>>>>> refs/remotes/origin/main
>>>>>>> 9e20c74 (Error Fixing)
  });

  it("should log the connection success message", () => {
    process.env.NODE_ENV = "development";

    const dbUrl = "mongodb://localhost:27017/testDB";
    const connection = makeNewConnection(dbUrl);

    // Mocks the 'connected' event
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
    // Mocks the 'error' event
    const testError = new Error("Test error");
    mongoose.connection.on.mock.calls.forEach((call) => {
      if (call[0] === "error") call[1](testError);
    });

    expect(console.log).toHaveBeenCalledWith(testError);
  });
});
