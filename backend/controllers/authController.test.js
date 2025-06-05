const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/initModels");
const authController = require("./authController");

jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("../models/initModels");

describe("Authentication Controller", () => {
  let mockRequest, mockResponse;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRequest = {
      body: {},
      user: { id: "user123" },
      file: { buffer: Buffer.from("test"), mimetype: "image/png" },
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    process.env.TOKEN_SECRET_KEY = "test-secret";
  });

  describe("register", () => {
    it("should reject missing fields", async () => {
      await authController.register(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: expect.stringContaining("All fields are required"),
      });
    });

    it("should reject invalid email format", async () => {
      mockRequest.body = {
        username: "test",
        pwd: "password123",
        name: "Test",
        email: "invalid-email",
      };

      await authController.register(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Please enter a valid email address.",
      });
    });

    it("should reject weak password", async () => {
      mockRequest.body = {
        username: "test",
        pwd: "short",
        name: "Test",
        email: "test@example.com",
      };

      await authController.register(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Password must be at least 8 characters long.",
      });
    });

    it("should reject duplicate username/email", async () => {
      mockRequest.body = {
        username: "existing",
        pwd: "password123",
        name: "Test",
        email: "test@example.com",
      };

      User.findOne.mockResolvedValue({ username: "existing" });

      await authController.register(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(409);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Username already taken.",
      });
    });

    it("should create new user successfully", async () => {
      mockRequest.body = {
        username: "newuser",
        pwd: "password123",
        name: "New User",
        email: "new@example.com",
      };

      User.findOne.mockResolvedValue(null);
      User.prototype.save.mockResolvedValue({
        _id: "123",
        username: "newuser",
      });
      bcrypt.hash.mockResolvedValue("hashedPassword");
      jwt.sign.mockReturnValue("test-token");

      await authController.register(mockRequest, mockResponse);

      expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
      expect(jwt.sign).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        token: "test-token",
        username: "newuser",
        userID: "123",
        message: "Account created successfully!",
      });
    });
  });

  describe("login", () => {
    it("should reject missing credentials", async () => {
      await authController.login(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Both username and password are required.",
      });
    });

    it("should reject non-existent user", async () => {
      mockRequest.body = { username: "nonexistent", pwd: "password123" };
      User.findOne.mockResolvedValue(null);

      await authController.login(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Authentication failed. User not found.",
      });
    });

    it("should reject incorrect password", async () => {
      mockRequest.body = { username: "testuser", pwd: "wrongpassword" };
      User.findOne.mockResolvedValue({
        username: "testuser",
        password: "hashedPassword",
      });
      bcrypt.compare.mockResolvedValue(false);

      await authController.login(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Authentication failed. Incorrect password.",
      });
    });

    it("should login successfully", async () => {
      mockRequest.body = { username: "testuser", pwd: "correctpassword" };
      User.findOne.mockResolvedValue({
        _id: "123",
        username: "testuser",
        password: "hashedPassword",
      });
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("test-token");

      await authController.login(mockRequest, mockResponse);

      expect(bcrypt.compare).toHaveBeenCalledWith(
        "correctpassword",
        "hashedPassword",
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        token: "test-token",
        username: "testuser",
        userID: "123",
        message: "Login successful.",
      });
    });
  });

  describe("Profile Operations", () => {
    describe("getProfile", () => {
      it("should return user profile without image", async () => {
        User.findById = jest.fn().mockReturnValue({
          select: jest.fn().mockResolvedValue({
            username: "testuser",
            name: "Test User",
            email: "test@example.com",
            profilePic: null,
            image: null,
            theme: "dark",
            font: "Roboto",
          }),
        });

        await authController.getProfile(mockRequest, mockResponse);

        expect(mockResponse.json).toHaveBeenCalledWith({
          username: "testuser",
          name: "Test User",
          email: "test@example.com",
          profilePic: null,
          image: null,
          theme: "dark",
          font: "Roboto",
        });
      });

      it("should return user profile with image", async () => {
        User.findById = jest.fn().mockReturnValue({
          select: jest.fn().mockResolvedValue({
            username: "testuser",
            name: "Test User",
            email: "test@example.com",
            image: {
              data: Buffer.from("test-image"),
              contentType: "image/png",
            },
          }),
        });

        await authController.getProfile(mockRequest, mockResponse);

        const response = mockResponse.json.mock.calls[0][0];
        expect(response.image).toMatch(/^data:image\/png;base64/);
        expect(response.profilePic).toMatch(/^data:image\/png;base64/);
      });
    });

    describe("updateProfileImage", () => {
      it("should reject if no file uploaded", async () => {
        mockRequest.file = null;

        await authController.updateProfileImage(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
          msg: "No file uploaded",
        });
      });

      it("should update profile image successfully", async () => {
        const updatedUser = {
          image: {
            data: Buffer.from("test"),
            contentType: "image/png",
          },
        };
        User.findByIdAndUpdate.mockResolvedValue(updatedUser);

        await authController.updateProfileImage(mockRequest, mockResponse);

        expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
          "user123",
          {
            image: {
              data: mockRequest.file.buffer,
              contentType: mockRequest.file.mimetype,
            },
          },
          { new: true },
        );
        expect(mockResponse.json).toHaveBeenCalledWith({
          msg: "Image saved",
          image: expect.stringContaining("data:image/png;base64"),
        });
      });
    });

    describe("updateProfile", () => {
      it("should reject missing fields", async () => {
        mockRequest.body = {};

        await authController.updateProfile(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
          msg: "All fields are required.",
        });
      });

      it("should update profile successfully", async () => {
        mockRequest.body = {
          username: "updated",
          name: "Updated Name",
          email: "updated@example.com",
          theme: "dark",
          font: "Arial",
        };

        const updatedUser = {
          username: "updated",
          name: "Updated Name",
          email: "updated@example.com",
          theme: "dark",
          font: "Arial",
        };
        User.findByIdAndUpdate = jest.fn().mockReturnValue({
          select: jest.fn().mockResolvedValue(updatedUser),
        });

        await authController.updateProfile(mockRequest, mockResponse);

        expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
          "user123",
          {
            username: "updated",
            name: "Updated Name",
            email: "updated@example.com",
            theme: "dark",
            font: "Arial",
          },
          { new: true },
        );
        expect(mockResponse.json).toHaveBeenCalledWith(updatedUser);
      });
    });
  });
});
