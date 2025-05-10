const { ObjectId } = require("mongodb");
const express = require("express");
const router = express.Router();
const User = require("../models/userSchema.js");

//get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(400).send(error);
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
