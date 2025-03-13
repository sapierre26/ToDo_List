// import mongoose, { Schema } from "mongoose";
const mongoose = require("mongoose");
const { tasksConnection } = require("../connection");

const taskSchema = new mongoose.Schema({
    date: { type: String, required: true },
    title: { type: String, required: true },
    priority: { type: String, required: true },
    label: { type: String, required: true },
    description: { type: String, required: false },
},
    { collections: "tasks" });

// const Task = mongoose.models['tasks'] || mongoose.model('tasks', taskSchema);

const Task = tasksConnection.model("tasks", taskSchema);

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