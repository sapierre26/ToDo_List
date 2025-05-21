const request = require("supertest");
const express = require("express");
const taskRouter = require("./path/to/your/router"); // Adjust the path to your router
const mongoose = require("mongoose");
const Task = require("../models/taskSchema");
process.env.MONGO_URI = "mongodb://localhost:27017/test";

// Mock Task model methods
jest.mock("../models/taskSchema");

const app = express();
app.use(express.json());
app.use("/api/tasks", taskRouter);

describe("Task Routes", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test for GET all tasks
  it("should get all tasks", async () => {
    const mockTasks = [
      { _id: "1", title: "Task 1", date: "2025-03-14", label: "Work", priority: "High" },
      { _id: "2", title: "Task 2", date: "2025-03-15", label: "Personal", priority: "Low" },
    ];

    Task.find.mockResolvedValueOnce(mockTasks);

    const response = await request(app).get("/api/tasks");
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockTasks);
  });

  // Test for POST a new task
  it("should create a new task", async () => {
    const newTask = {
      _id: "3",
      title: "Task 3",
      date: "2025-03-16",
      label: "Work",
      priority: "Medium",
      description: "Test task description",
    };

    Task.prototype.save.mockResolvedValueOnce(newTask);

    const response = await request(app)
      .post("/api/tasks")
      .send(newTask);
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ msg: `${newTask} added to the taskDB` });
  });

  // Test for PUT update a task (In your code, this is actually creating a new task, so it's tested as POST)
  it("should update an existing task", async () => {
    const updatedTask = {
      _id: "3",
      title: "Updated Task",
      date: "2025-03-16",
      label: "Work",
      priority: "Medium",
      description: "Updated description",
    };

    Task.prototype.save.mockResolvedValueOnce(updatedTask);

    const response = await request(app)
      .put("/api/tasks")
      .send(updatedTask);
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ msg: `${updatedTask} added to the taskDB` });
  });

  // Test for DELETE a task
  it("should delete a task by ID", async () => {
    const mockTask = { _id: "1", title: "Task 1", date: "2025-03-14", label: "Work", priority: "High" };

    Task.findByIdAndDelete.mockResolvedValueOnce(mockTask);

    const response = await request(app).delete("/api/tasks/1");
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Task deleted successfully" });
  });

  // Test for DELETE a task that doesn't exist
  it("should return 404 if task not found for deletion", async () => {
    Task.findByIdAndDelete.mockResolvedValueOnce(null);

    const response = await request(app).delete("/api/tasks/1");
    
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Task not found" });
  });

  // Test for GET tasks with date query parameter
  it("should get tasks filtered by date", async () => {
    const mockTasks = [
      { _id: "1", title: "Task 1", date: "2025-03-14", label: "Work", priority: "High" },
      { _id: "2", title: "Task 2", date: "2025-03-14", label: "Personal", priority: "Low" },
    ];

    Task.find.mockResolvedValueOnce(mockTasks);

    const response = await request(app).get("/api/tasks?date=2025-03-14");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockTasks);
  });

  // Test for GET tasks without date query parameter
  it("should get all tasks when no date is provided", async () => {
    const mockTasks = [
      { _id: "1", title: "Task 1", date: "2025-03-14", label: "Work", priority: "High" },
      { _id: "2", title: "Task 2", date: "2025-03-15", label: "Personal", priority: "Low" },
    ];

    Task.find.mockResolvedValueOnce(mockTasks);

    const response = await request(app).get("/api/tasks");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockTasks);
  });

  // Test for API error when Task.find fails
  it("should return 400 if there is an error with task retrieval", async () => {
    Task.find.mockRejectedValueOnce(new Error("Database error"));

    const response = await request(app).get("/api/tasks");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Database error" });
  });

  // Test for POST error when creating a task
  it("should return 400 if there is an error creating a task", async () => {
    Task.prototype.save.mockRejectedValueOnce(new Error("Database error"));

    const response = await request(app)
      .post("/api/tasks")
      .send({
        _id: "3",
        title: "Task 3",
        date: "2025-03-16",
        label: "Work",
        priority: "Medium",
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Database error" });
  });

});
