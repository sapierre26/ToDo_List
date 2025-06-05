const jwt = require("jsonwebtoken");
const authenticateToken = require("./auth");

// Mock jwt.verify
jest.mock("jsonwebtoken");

describe("authenticateToken middleware", () => {
  let mockRequest, mockResponse, mockNext;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRequest = {
      headers: {},
    };

    mockResponse = {
      sendStatus: jest.fn().mockReturnThis(),
    };

    mockNext = jest.fn();

    process.env.TOKEN_SECRET_KEY = "test-secret-key";
  });

  it("should return 403 if no token is provided", () => {
    authenticateToken(mockRequest, mockResponse, mockNext);

    expect(mockResponse.sendStatus).toHaveBeenCalledWith(403);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should return 403 if authorization header is malformed", () => {
    mockRequest.headers.authorization = "MalformedToken";

    authenticateToken(mockRequest, mockResponse, mockNext);

    expect(mockResponse.sendStatus).toHaveBeenCalledWith(403);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should return 403 if token is invalid", () => {
    mockRequest.headers.authorization = "Bearer invalid.token.here";
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(new Error("Invalid token"), null);
    });

    authenticateToken(mockRequest, mockResponse, mockNext);

    expect(jwt.verify).toHaveBeenCalledWith(
      "invalid.token.here",
      "test-secret-key",
      expect.any(Function),
    );
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(403);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should call next() and add user to request if token is valid", () => {
    const testUser = { id: "123", username: "testuser" };
    mockRequest.headers.authorization = "Bearer valid.token.here";
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, testUser);
    });

    authenticateToken(mockRequest, mockResponse, mockNext);

    expect(jwt.verify).toHaveBeenCalledWith(
      "valid.token.here",
      "test-secret-key",
      expect.any(Function),
    );
    expect(mockRequest.user).toEqual(testUser);
    expect(mockNext).toHaveBeenCalled();
    expect(mockResponse.sendStatus).not.toHaveBeenCalled();
  });

  it("should handle different Authorization header formats", () => {
    const testCases = [
      { header: "Bearer token", expected: "token" },
      { header: "bearer token", expected: "token" },
      { header: "BEARER token", expected: "token" },
      { header: "Token token", expected: "token" },
      { header: "Basic token", expected: "token" },
    ];

    testCases.forEach(({ header, expected }) => {
      mockRequest.headers.authorization = header;
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, {});
      });

      authenticateToken(mockRequest, mockResponse, mockNext);

      expect(jwt.verify).toHaveBeenCalledWith(
        expected,
        "test-secret-key",
        expect.any(Function),
      );
      jest.clearAllMocks();
    });
  });
});
