const { getTasks, addTask } = require("../../frontend/src/api/tasks"); // Adjust path as needed
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

// Your Task Schema (this should be the same as the one used in your app)
const TaskSchema = new mongoose.Schema({
  _id: String,
  date: String,
  title: String,
  label: String,
  priority: String,
  description: String,
});

let mongoServer;
let conn;
let taskModel;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  conn = await mongoose.createConnection(uri, mongooseOpts);

  taskModel = conn.model("Task", TaskSchema);
});

afterAll(async () => {
  await conn.dropDatabase();
  await conn.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Setup dummy tasks
  let dummyTask = {
    _id: "1",
    date: "2025-03-10",
    title: "Task 1",
    label: "Important",
    priority: "High",
    description: "Task description",
  };
  let result = new taskModel(dummyTask);
  await result.save();

  dummyTask = {
    _id: "2",
    date: "2025-03-11",
    title: "Task 2",
    label: "Normal",
    priority: "Medium",
    description: "Task 2 description",
  };
  result = new taskModel(dummyTask);
  await result.save();
});

afterEach(async () => {
  await taskModel.deleteMany();
});

// Test: Fetching all tasks
test("Fetching all tasks", async () => {
  const tasks = await getTasks();
  expect(tasks).toBeDefined();
  expect(tasks.length).toBeGreaterThan(0);
});

// Test: Adding a task successfully
test("Adding task -- successful path", async () => {
  const newTask = {
    _id: "3",
    date: "2025-03-12",
    title: "Task 3",
    label: "Urgent",
    priority: "High",
    description: "Urgent task description",
  };

  const result = await addTask(newTask);
  expect(result).toBe(true); // Task added successfully
});

// Test: Adding task with missing fields (failure path)
test("Adding task -- failure path with missing fields", async () => {
  const newTask = {
    _id: "4",
    date: "2025-03-13",
    title: "", // Missing title
    label: "Urgent",
    priority: "High",
  };

  const result = await addTask(newTask);
  expect(result).toBe(false); // Task should not be added due to validation failure
});
