const { ObjectId } = require("mongodb");
const express = require("express");
const router = express.Router();
const User = require("../models/userSchema.js");

//get all users
router.get("/", async (req, res) => {
    try {
      const users = await User.find({})
      res.send(users);
    } catch (error) {
      res.status(400).send(error);
    }
  });

module.exports = router
