const express = require("express");
const router = express.Router();
const Task = require("../models/taskSchema.js");

router.use("/", (req, res, next) => {
  console.log(`Request made to ${req.method} ${req.originalUrl}`);
  next(); // pass control to the next handler
});

router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({});
    console.log("Got all tasks");
    console.log(tasks);
    
    // Send the response and return to stop further execution
    return res.send(tasks);
  } catch (error) {
    // Send error response and return to stop further execution
    return res.status(400).send(error);
  }
});



module.exports = router;
