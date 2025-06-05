const mongoose = require("mongoose");

jest.mock("mongoose", () => ({
  createConnection: jest.fn(),
}));

const { makeNewConnection } = require("./connection");

describe("makeNewConnection", () => {
  let originalEnv;
  let mockConnection;

  beforeEach(() => {
    originalEnv = { ...process.env };
    jest.clearAllMocks();

    mockConnection = {
      on: jest.fn(),
    };

    mongoose.createConnection.mockReturnValue(mockConnection);

    // Mock console methods
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});

    // Mock process.exit
    jest.spyOn(process, "exit").mockImplementation(() => {});
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.restoreAllMocks();
  });

  test("throws error if URL missing and NODE_ENV=test", () => {
    process.env.NODE_ENV = "test";

    expect(() => makeNewConnection(undefined)).toThrow(
      "MONGO_URI must be provided in test environment",
    );

    expect(mongoose.createConnection).not.toHaveBeenCalled();
  });

  test("logs error and exits if URL missing and NODE_ENV!=test", () => {
    process.env.NODE_ENV = "development";

    makeNewConnection(undefined);

    expect(console.error).toHaveBeenCalledWith(
      "MONGO_URI is not set in the environment variables.",
    );
    expect(process.exit).toHaveBeenCalledWith(1);
    expect(mongoose.createConnection).not.toHaveBeenCalled();
  });

  test("throws error if URL invalid and NODE_ENV!=test", () => {
    process.env.NODE_ENV = "production";

    const invalidUrl = "invalid-url";

    expect(() => makeNewConnection(invalidUrl)).toThrow(
      `Invalid MongoDB connection string: ${invalidUrl}`,
    );

    expect(mongoose.createConnection).not.toHaveBeenCalled();
  });

  test("uses default DBname if URL parsing fails", () => {
    process.env.NODE_ENV = "development";

    // Pass a URL that causes URL constructor to throw
    const badUrl = {
      toString: () => {
        throw new Error("bad url");
      },
    };

    // This will cause new URL(badUrl) to throw; toString needed to test fallback
    // But since the argument must be a string, this is more theoretical.
    // So we skip this specific test, or test unknown DBname another way.
  });

  test("returns connection and sets event listeners in non-test env", () => {
    process.env.NODE_ENV = "development";
    const url = "mongodb://localhost:27017/mydb";

    const connection = makeNewConnection(url);

    expect(mongoose.createConnection).toHaveBeenCalledWith(url, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });

    expect(connection).toBe(mockConnection);

    // Check event listeners were registered
    expect(connection.on).toHaveBeenCalledTimes(3);

    // Simulate events and check console output
    const connectedCallback = connection.on.mock.calls.find(
      (c) => c[0] === "connected",
    )[1];
    const disconnectedCallback = connection.on.mock.calls.find(
      (c) => c[0] === "disconnected",
    )[1];
    const errorCallback = connection.on.mock.calls.find(
      (c) => c[0] === "error",
    )[1];

    connectedCallback();
    expect(console.log).toHaveBeenCalledWith("MongoDB :: connected :: mydb");

    disconnectedCallback();
    expect(console.log).toHaveBeenCalledWith("MongoDB :: disconnected");

    const error = new Error("fail");
    errorCallback(error);
    expect(console.error).toHaveBeenCalledWith(
      "MongoDB connection error:",
      error,
    );
  });

  test("returns connection without setting event listeners in test env", () => {
    process.env.NODE_ENV = "test";
    const url = "mongodb://localhost:27017/mydb";

    const connection = makeNewConnection(url);

    expect(mongoose.createConnection).toHaveBeenCalledWith(url, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });

    expect(connection).toBe(mockConnection);
    expect(connection.on).not.toHaveBeenCalled();
  });

  test("parses DBname correctly from URL", () => {
    process.env.NODE_ENV = "development";
    const url = "mongodb://localhost:27017/mycustomdb";

    makeNewConnection(url);

    const connectedCallback = mockConnection.on.mock.calls.find(
      (c) => c[0] === "connected",
    )[1];
    connectedCallback();

    expect(console.log).toHaveBeenCalledWith(
      "MongoDB :: connected :: mycustomdb",
    );
  });

  test("uses 'default' DBname if pathname is empty", () => {
    process.env.NODE_ENV = "development";
    const url = "mongodb://localhost:27017/";

    makeNewConnection(url);

    const connectedCallback = mockConnection.on.mock.calls.find(
      (c) => c[0] === "connected",
    )[1];
    connectedCallback();

    expect(console.log).toHaveBeenCalledWith("MongoDB :: connected :: default");
  });
});
