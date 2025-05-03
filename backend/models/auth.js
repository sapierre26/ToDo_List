import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import connectDB from "../db.js";
import userModel from "./userSchema.js";

dotenv.config();

const User = require("../models/userSchema");
const user = await User.findOne({ username: email });
if (!user) return res.status(401).json({ error: "invalid credentials" });

const isMatch = await bcrypt.compare(password, user.password);

const generateAccessToken = (username, userId) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { username, id: userId },
      process.env.TOKEN_SECRET,
      { expiresIn: '1d' },
      (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token);
        }
      }
    );
  });
};

export const registerUser = async (req, res) => {
  const { username, pwd } = req.body;

  if (!username || !pwd) {
    return res.status(400).send("Bad request: Missing username or password.");
  }

  try {
    await connectDB();
    const existingUser = await userModel.findOne({ username });
    if (existingUser) {
      return res.status(409).send("Username already taken.");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(pwd, salt);
    const newUser = new userModel({ username, password: hashedPassword });
    const savedUser = await newUser.save();

    const token = await generateAccessToken(retrieveUser.username, retrievedUser._id);
    console.log("Registration successful. Token:", token);
    res.status(201).json({ 
      token, 
      username: savedUser.username,
      userID: savedUser._id
    });
  } catch (err) {
    console.error("Error during user registration:", err);
    res.status(500).send("Server error during registration.");
  }
};

export const loginUser = async (req, res) => {
  const { username, pwd } = req.body;

  if (!username || !pwd) {
    return res.status(400).send("Bad request: Both username and password are required.");
  }

  try {
    const retrievedUser = await userModel.findOne({ username });
    if (!retrievedUser) {
      return res.status(401).send("Unauthorized: User not found.");
    }

    const matched = await bcrypt.compare(pwd, retrievedUser.password);
    if (matched) {
      const token = jwt.sign(
        { username: retrievedUser.username, id: retrievedUser._id },
        process.env.TOKEN_SECRET,
        { expiresIn: '1h' }
      );

      res.status(200).json({ 
        token, 
        username: retrievedUser.username,
        userID: retrievedUser._id 
      });
    } else {
      res.status(401).send("Unauthorized: Password does not match.");
    }
  } catch (error) {
    console.error("Error during user login:", error);
    res.status(500).send("Server error during login.");
  }
};

export function authenticateUser(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    console.log("No token received");
    return res.status(401).end();
  } else {
    jwt.verify(token, process.env.TOKEN_SECRET, (error, decoded) => {
      if (error) {
        console.log("JWT error:", error);
        return res.status(403).send("Forbidden: Invalid token.");
      }
      req.user = decoded;
      next();
    });
  }
}