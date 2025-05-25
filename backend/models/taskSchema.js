// import mongoose, { Schema } from "mongoose";
const mongoose = require("mongoose");
const { tasksConnection } = require("../connection");

const taskSchema = new mongoose.Schema(
  {
    title: String,
    startDate: { type: Date },
    endDate: { type: Date },
    priority: String,
    label: String,
    description: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }
  },
  { collections: "tasks" },
);

// const Task = mongoose.models['tasks'] || mongoose.model('tasks', taskSchema);
let Task;
if (tasksConnection) {
  Task = tasksConnection.model("tasks", taskSchema);
} else {
  Task = mongoose.model("tasks", taskSchema);
}

module.exports = Task;

// whenever task is called
// async function getTasks(){
//     await connectDB()
//     try {
//         const tasks = await Task.find().orFail()
//         return tasks
//     } catch (err) {
//         return null
//     }
// }
