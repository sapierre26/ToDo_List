jest.mock("../middleware/auth", () => (req, res, next) => {
  req.user = { id: "507f1f77bcf86cd799439011" };
  next();
});
const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { Task } = require("../models/initModels");
const app = require("../server");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  process.env.tasksDB = uri;
  process.env.userDB = uri;

  require("../models/initModels");
});

afterEach(async () => {
  const { Task } = require("../models/initModels");
  await Task.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Task Routes with In-Memory MongoDB", () => {
  it("should create a new task", async () => {
    const newTask = {
      title: "Test Task",
      startDate: new Date("2025-06-01"),
      endDate: new Date("2025-06-02"),
      priority: "High",
      label: "Work",
      description: "Test description",
    };

    const response = await request(app).post("/api/tasks").send(newTask);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      msg: `${newTask.title} added to the taskDB`,
      task: expect.any(Object),
    });
  });

  // Test for PUT update a task (In your code, this is actually creating a new task, so it's tested as POST)
  it("should update an existing task", async () => {
    const createdTask = await Task.create({
      title: "Old Title",
      startDate: new Date("2025-03-16"),
      endDate: new Date("2025-03-17"),
      label: "Work",
      priority: "Medium",
      description: "Old description",
      userId: "507f1f77bcf86cd799439011",
    });
    const updatedTask = {
      title: "Updated Task",
      description: "Updated description",
    };
    const response = await request(app)
      .put(`/api/tasks/${createdTask._id}`)
      .send(updatedTask);
    expect(response.status).toBe(200);
    expect(response.body.title).toBe("Updated Task");
  });

  it("should get all tasks for the user", async () => {
    await Task.create([
      {
        title: "Task 1",
        startDate: new Date("2025-06-01"),
        endDate: new Date("2025-06-02"),
        priority: "Medium",
        label: "Personal",
        userId: "507f1f77bcf86cd799439011",
      },
      {
        title: "Task 2",
        startDate: new Date("2025-06-03"),
        endDate: new Date("2025-06-04"),
        priority: "Low",
        label: "Work",
        userId: "507f1f77bcf86cd799439011",
      },
    ]);

    const res = await request(app).get("/api/tasks");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it("should filter tasks by date", async () => {
    await Task.create([
      {
        title: "Same Day Task",
        startDate: new Date("2025-06-01T08:00:00Z"),
        endDate: new Date("2025-06-01T18:00:00Z"),
        priority: "High",
        label: "Work",
        userId: "507f1f77bcf86cd799439011",
      },
      {
        title: "Outside Date Range",
        startDate: new Date("2025-06-05"),
        endDate: new Date("2025-06-06"),
        priority: "Low",
        label: "Personal",
        userId: "507f1f77bcf86cd799439011",
      },
    ]);

    const res = await request(app).get("/api/tasks?date=2025-06-01");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].title).toBe("Same Day Task");
  });

  it("should update a task", async () => {
    const task = await Task.create({
      title: "Old Title",
      startDate: new Date("2025-06-01"),
      endDate: new Date("2025-06-02"),
      priority: "Medium",
      label: "Work",
      userId: "507f1f77bcf86cd799439011",
    });

    const res = await request(app)
      .put(`/api/tasks/${task._id}`)
      .send({ title: "Updated Title" });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Updated Title");
  });

  it("should delete a task", async () => {
    const task = await Task.create({
      title: "To Be Deleted",
      startDate: new Date(),
      endDate: new Date(),
      priority: "Low",
      label: "Work",
      userId: "507f1f77bcf86cd799439011",
    });

    const res = await request(app).delete(`/api/tasks/${task._id}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Task deleted successfully");
  });

  it("should return 404 when task to delete is not found", async () => {
    const res = await request(app).delete(
      `/api/tasks/665a3d95e92f3bb8dc83f999`,
    );

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Task not found");
  });
});
