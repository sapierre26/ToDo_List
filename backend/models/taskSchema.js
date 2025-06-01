const mongoose = require("mongoose");
const { makeNewConnection } = require("../connection");
const tasksConnection = makeNewConnection(process.env.tasksDB);
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
    },
  },
  { collections: "tasks" }
);

let Task;
if (tasksConnection) {
  Task = tasksConnection.model("tasks", taskSchema);
} else {
  Task = mongoose.model("tasks", taskSchema);
}

module.exports = Task;
