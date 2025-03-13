const express = require("express");
const router = express.Router();
// app.use(express.json());  

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

router.post("/", async (req, res) => {
  try {
    const {
      _id,
      title,
      date,
      priority,
      label,
      description
    } = req.body;
    const newTask = new Task({
      _id,
      title,
      date,
      priority,
      label,
      description
    });
    await newTask.save();
    res.send({msg: `${newTask} added to the taskDB`});
  }catch (error) {
    let errorMessage;
    if (error instanceof Error) { 
      errorMessage = error.message; 
    } else { 
      errorMessage = String(errorMessage); 
    }
    res.status(400).send({error: errorMessage});
    console.log(`Error: ${errorMessage}`);
  }
});

router.put("/", async (req, res) => {
  try {
    const {
      _id,
      title,
      date,
      priority,
      label,
      description
    } = req.body;
    const newTask = new Task({
      _id,
      title,
      date,
      priority,
      label,
      description
    });
    await newTask.save();
    res.send({msg: `${newTask} added to the taskDB`});
  }catch (error) {
    let errorMessage;
    if (error instanceof Error) { 
      errorMessage = error.message; 
    } else { 
      errorMessage = String(errorMessage); 
    }
    res.status(400).send({error: errorMessage});
    console.log(`Error: ${errorMessage}`);
  }
});

router.delete("/:_id", async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    return res.status(500).json({ message: "Error deleting task" });
  }
});

// router.get("/date/:date", async (req, res) => {
//   try {
//     const task = await Task.findOne({ date: req.params.date })
//     console.log("reached here")
//     res.send(task)
//     console.log('got task with id %s', req.params.date)
//   } catch (error) {
//     res.status(400).send(error);
//   }
// })

router.get("/", async (req, res) => {
  try {
    const { date } = req.query; // Extract 'date' from the query parameters

    let tasks;
    if (date) {
      // If the 'date' query parameter is provided, filter tasks by date
      tasks = await Task.find({ date: date });
    } else {
      // If no 'date' parameter is provided, return all tasks
      tasks = await Task.find({});
    }

    console.log("Got tasks:", tasks);
    res.send(tasks);
  } catch (error) {
    res.status(400).send(error);
  }
});