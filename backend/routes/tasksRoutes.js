//taskRoutes.js
const express = require("express");
const router = express.Router();
const { Task } = require("../models/initModels");
const auth = require("../middleware/auth");

// Apply auth middleware to all routes
router.use(auth);

// GET /api/tasks - get all tasks for a user
router.get("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const { date } = req.query;
    let query = { userId };

    if (date) {
      const [year, month, day] = date.split("-");
      const startOfDay = new Date(year, month - 1, day);
      const endOfDay = new Date(year, month - 1, day);
      endOfDay.setHours(23, 59, 59, 999);

      query.startDate = { $lte: endOfDay };
      query.endDate = { $gte: startOfDay };
    }

    const tasks = await Task.find(query);
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Database error" });
  }
});

// POST /api/tasks - create a new task
router.post("/", async (req, res) => {
  try {
    const newTask = new Task({ ...req.body, userId: req.user.id });
    await newTask.save();
    res
      .status(200)
      .json({ msg: `${newTask.title} added to the taskDB`, task: newTask });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/tasks/:id - update a task
router.put("/:id", async (req, res) => {
  try {
    const taskId = req.params.id;
    const updates = req.body;

    const updatedTask = await Task.findByIdAndUpdate(taskId, updates, {
      new: true,
    });

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/tasks/:id - delete a task
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
