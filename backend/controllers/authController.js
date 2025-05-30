// controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema.js");
require("dotenv").config();

const generateAccessToken = (username, userId) => {
  return jwt.sign({ username, id: userId }, process.env.TOKEN_SECRET_KEY, {
    expiresIn: "1h",
  });
};

// controllers/authController.js
const register = async (req, res) => {
  const { username, pwd, name, email } = req.body;

  // Validate input more thoroughly
  if (!username || !pwd || !name || !email) {
    return res.status(400).json({ 
      success: false,
      message: "All fields are required: name, username, email, and password."
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid email address."
    });
  }

  // Validate password strength
  if (pwd.length < 8) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 8 characters long."
    });
  }

  try {
    // Check for existing user
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: existingUser.username === username 
          ? "Username already taken." 
          : "Email already registered."
      });
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(pwd, 10);
    const newUser = new User({
      name,
      username,
      password: hashedPassword,
      email,
    });
    
    const savedUser = await newUser.save();
    const token = generateAccessToken(savedUser.username, savedUser._id);

    res.status(201).json({
      success: true,
      token,
      username: savedUser.username,
      userID: savedUser._id,
      message: "Account created successfully!"
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({
      success: false,
      message: "Server error during registration.",
      error: err.message
    });
  }
};

const login = async (req, res) => {
  const { username, pwd } = req.body;

  if (!username || !pwd) {
    return res.status(400).json({
      success: false,
      message: "Both username and password are required."
    });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed. User not found."
      });
    }

    const isMatch = await bcrypt.compare(pwd, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed. Incorrect password."
      });
    }

    const token = generateAccessToken(user.username, user._id);
    res.status(200).json({
      success: true,
      token,
      username: user.username,
      userID: user._id,
      message: "Login successful."
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      success: false,
      message: "Server error during login.",
      error: err.message
    });
  }
};
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("username email name image");
    if (!user) return res.status(404).json({ msg: "User not found" });

    let base64Image = null;
    if (user.image && user.image.data) {
      base64Image = `data:${user.image.contentType};base64,${user.image.data.toString("base64")}`;
    }

    res.json({
      username: user.username,
      name: user.name,
      email: user.email,
      image: base64Image,
    });
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

const updateProfileImage = async (req, res) => {
  if (!req.file) return res.status(400).json({ msg: "No file uploaded" });

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        image: {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        },
      },
      { new: true }
    );

    const base64 = updatedUser.image.data.toString("base64");
    const mimeType = updatedUser.image.contentType;

    res.json({
      msg: "Image saved",
      image: `data:${mimeType};base64,${base64}`,
    });
  } catch (err) {
    console.error("Image save error:", err);
    res.status(500).json({ msg: "Failed to save image" });
  }
};



const updateProfile = async (req, res) => {
  const { username, name, email, theme, font } = req.body;

  if (!username || !name || !email) {
    return res.status(400).json({ msg: "All fields are required." });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        username,
        name,
        email,
        ...(theme && { theme }),  // only update if provided
        ...(font && { font }),    // only update if provided
      },
      { new: true }
    ).select("username name email theme font");

    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found." });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ msg: "Failed to update profile." });
  }
};


module.exports = { register, login, getProfile, updateProfileImage, updateProfile, };
