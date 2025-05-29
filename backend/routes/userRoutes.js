const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema.js");

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Login route
router.post("/login", async (req, res) => {
  console.log("received login body:", req.body);

  const { username, pwd } = req.body;

  if (!username || !pwd) {
    return res.status(400).send("missing fields");
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).send("The user does not exist, please sign up");
    }

    const isMatch = await bcrypt.compare(pwd, user.password);
    if (!isMatch) {
      return res.status(401).send("incorrect password");
    }

    const token = jwt.sign(
      { username: user.username, id: user._id },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: "1h" },
    );

    res.status(200).json({
      token,
      username: user.username,
      userId: user._id,
    });
  } catch (err) {
    console.error("login error:", err);
    res.status(500).send("server error during login");
  }
});

//get user by username
router.get("/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).send({ message: "User not found" });
    res.send(user);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

module.exports = router;
