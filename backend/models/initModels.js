const { makeNewConnection } = require("../connection");
const taskSchema = require("./taskSchema");
const userSchema = require("./userSchema");

const tasksConnection = makeNewConnection(process.env.tasksDB);
const Task = tasksConnection.model("Task", taskSchema);

const userConnection = makeNewConnection(process.env.userDB);
const User = userConnection.model("User", userSchema);

module.exports = { Task, User };
