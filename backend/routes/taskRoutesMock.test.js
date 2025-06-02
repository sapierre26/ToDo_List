jest.mock("../middleware/auth", () => (req, res, next) => {
  req.user = { id: "507f1f77bcf86cd799439011" };
  next();
});
const request = require("supertest");
const express = require("express");
const mockingoose = require("mockingoose");
const taskRoutes = require("./tasksRoutes");
const { Task } = require("../models/initModels");

process.env.MONGO_URI = "mongodb://localhost:27017/test";

// Mock middleware to simulate authenticated user

const app = express();
app.use(express.json());
app.use("/api/tasks", taskRoutes);

describe("Task Routes (Mocked)", () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  test("GET /api/tasks should return mocked tasks", async () => {
    const mockedTasks = [
      {
        _id: "task1",
        title: "Mock Task",
        startDate: new Date(),
        endDate: new Date(),
        priority: "High",
        label: "Work",
        description: "Description",
        userId: "507f1f77bcf86cd799439011",
      },
    ];

    mockingoose(Task).toReturn(mockedTasks, "find");

    const res = await request(app).get("/api/tasks");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].title).toBe("Mock Task");
  });

  test("POST /api/tasks should create a task", async () => {
    const mockTask = {
      title: "New Task",
      startDate: new Date(),
      endDate: new Date(),
      priority: "Low",
      label: "Personal",
      description: "Test create task",
    };

    mockingoose(Task).toReturn(
      { ...mockTask, _id: "123", userId: "507f1f77bcf86cd799439011" },
      "save",
    );

    const res = await request(app).post("/api/tasks").send(mockTask);
    expect(res.statusCode).toBe(200);
    expect(res.body.task.title).toBe("New Task");
  });

  test("PUT /api/tasks/:id should update a task", async () => {
    const updatedTask = {
      _id: "123",
      title: "Updated Task",
      userId: "507f1f77bcf86cd799439011",
    };

    mockingoose(Task).toReturn(updatedTask, "findOneAndUpdate");

    const res = await request(app)
      .put("/api/tasks/123")
      .send({ title: "Updated Task" });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Updated Task");
  });

  test("DELETE /api/tasks/:id should delete a task", async () => {
    const deletedTask = {
      _id: "123",
      title: "Task to Delete",
      userId: "507f1f77bcf86cd799439011",
    };

    mockingoose(Task).toReturn(deletedTask, "findOneAndDelete");

    const res = await request(app).delete("/api/tasks/123");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Task deleted successfully");
  });
});
