// controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema.js");
require("dotenv").config();

const generateAccessToken = (username, userId) => {
  return jwt.sign(
    { username, id: userId },
    process.env.TOKEN_SECRET_KEY,
    { expiresIn: '1h' }
  );
};

const register = async (req, res) => {
  const { username, pwd, name, email } = req.body;

  if (!username || !pwd || !name) {
    return res.status(400).send("Missing fields: name, username, or password.");
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).send("Username already taken.");
    }

    const hashedPassword = await bcrypt.hash(pwd, 10);
    const newUser = new User({ name, username, password: hashedPassword, email });
    const savedUser = await newUser.save();
    const token = generateAccessToken(savedUser.username, savedUser._id);

    res.status(201).json({ token, username: savedUser.username, userID: savedUser._id });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).send("Server error during registration.");
  }
};

const login = async (req, res) => {
  const { username, pwd } = req.body;

  if (!username || !pwd) {
    return res.status(400).send("Missing username or password.");
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).send("User not found.");
    }

    const isMatch = await bcrypt.compare(pwd, user.password);
    if (!isMatch) {
      return res.status(401).send("Incorrect password.");
    }

    const token = generateAccessToken(user.username, user._id);
    res.status(200).json({ token, username: user.username, userID: user._id });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Server error during login.");
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("username email name");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

const updateProfileImage = async (req, res) => {
  console.log("FILE:", req.file); 
  if (!req.file) return res.status(400).json({ msg: "no file uploaded" });

  try {
    const imagePath = `/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { image: imagePath },
      { new: true }
    ).select("username email name image");
    res.json(user);
  } catch (err) {
    console.error("Image upload error:", err);
    res.status(500).json({ msg: "failed to upload image" });
  }
};

module.exports = { register, login, getProfile, updateProfileImage };