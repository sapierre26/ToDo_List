import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import connectDB from "../db.js";
import userModel from "./userSchema.js";

dotenv.config();

const generateAccessToken = (username, userId) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { username, id: userId },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: "1d" },
      (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token);
        }
      },
    );
  });
};

export const registerUser = async (req, res) => {
  const { username, pwd } = req.body;

  if (!username) {
    return res.status(400).json({
      success: false,
      message: "Bad request: Missing username.",
    });
  }

  if (!pwd) {
    return res.status(400).json({
      success: false,
      message: "Bad request: Missing password.",
    });
  }

  try {
    await connectDB();
    const existingUser = await userModel.findOne({ username });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Username already taken.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(pwd, salt);
    const newUser = new userModel({ username, password: hashedPassword });
    const savedUser = await newUser.save();

    const token = await generateAccessToken(savedUser.username, savedUser._id);
    console.log("Registration successful. Token:", token);
    res.status(201).json({
      token,
      username: savedUser.username,
      userID: savedUser._id,
    });
  } catch (err) {
    console.error("Error during user registration:", err);
    res.status(500).json({
      success: false,
      message: "Server error during registration.",
      error: "Invalid credentials",
    });
  }
};

export const loginUser = async (req, res) => {
  const { username, pwd } = req.body;

  if (!username && !pwd) {
    return res.status(400).json({
      success: false,
      message: "All fields are required.",
    });
  }

  if (!username) {
    return res.status(400).json({
      success: false,
      message: "Missing username.",
    });
  }

  if (!pwd) {
    return res.status(400).json({
      success: false,
      message: "Missing password.",
    });
  }

  try {
    const retrievedUser = await userModel.findOne({ username });
    if (!retrievedUser) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not found.",
      });
    }

    const matched = await bcrypt.compare(pwd, retrievedUser.password);
    if (!matched) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Password does not match.",
      });
    }

    const token = jwt.sign(
      { username: retrievedUser.username, id: retrievedUser._id },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: "1h" },
    );

    res.status(200).json({
      token,
      username: retrievedUser.username,
      userID: retrievedUser._id,
    });
  } catch (error) {
    console.error("Error during user login:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login.",
      error: error.message,
    });
  }
};

export function authenticateUser(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    console.log("No token received");
    return res.status(401).json({
      success: false,
      message: "Unauthorized: No token provided.",
    });
  } else {
    jwt.verify(token, process.env.TOKEN_SECRET_KEY, (error, decoded) => {
      if (error) {
        console.log("JWT error:", error);
        return res.status(403).json({
          success: false,
          message: "Forbidden: Invalid token.",
        });
      }
      req.user = decoded;
      next();
    });
  }
}
