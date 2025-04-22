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
    const { date, startDate, endDate } = req.query;
    let query = {};

    if (date) {
      // Existing date-specific logic
      const [year, month, day] = date.split('-');
      const startOfDay = new Date(year, month-1, day);
      const endOfDay = new Date(year, month-1, day);
      endOfDay.setHours(23, 59, 59, 999);

      query = {
        $or: [
          { 
            startDate: { $lte: endOfDay },
            endDate: { $gte: startOfDay }
          },
          {
            endDate: {
              $gte: startOfDay,
              $lte: endOfDay
            }
          }
        ]
      };
    } else if (startDate && endDate) {
      // New month-range logic
      query = {
        endDate: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    }

    const tasks = await Task.find(query);
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      _id,
      title,
      startDate,
      endDate,
      priority,
      label,
      description
    } = req.body;

    const startTaskDate = new Date(startDate);
    const endTaskDate = new Date(endDate);

    const newTask = new Task({
      _id,
      title,
      startDate: startTaskDate,
      endDate: endTaskDate,
      priority,
      label,
      description
    });

    await newTask.save();
    res.send({ msg: `${newTask} added to the taskDB` });
  } catch (error) {
    let errorMessage;
    if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = String(errorMessage);
    }
    res.status(400).send({ error: errorMessage });
    console.log(`Error: ${errorMessage}`);
  }
});

// router.get("/", async (req, res) => {
//   try {
//     const { startDate, endDate } = req.query; // Extract 'startDate' and 'endDate' from the query parameters

//     let tasks;
//     if (startDate && endDate) {
//       // If 'startDate' and 'endDate' are provided, filter tasks by date range
//       tasks = await Task.find({
//         startDate: { $gte: new Date(startDate) },
//         endDate: { $lte: new Date(endDate) }
//       });
//     } else {
//       // If no date parameters are provided, return all tasks
//       tasks = await Task.find({});
//     }

//     console.log("Got tasks:", tasks);
//     res.send(tasks);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });


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

module.exports = router;