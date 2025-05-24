const request = require("supertest");
const express = require("express");
const mockingoose = require("mockingoose");
const Task = require("../models/taskSchema");
const taskRoutes = require("./taskRoutes");

const app = express();
app.use(express.json());
app.use("/", taskRoutes);

describe("GET /tasks with date query", () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  it("returns tasks within specific date", async () => {
    const mockTasks = [
      {
        _id: "1",
        title: "Mock Task",
        startDate: new Date("2025-04-15T08:00:00Z"),
        endDate: new Date("2025-04-15T12:00:00Z"),
        label: "Task",
        priority: "High",
      },
    ];

    mockingoose(Task).toReturn(mockTasks, "find");

    const response = await request(app).get("/?date=2025-04-15");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.arrayContaining([expect.objectContaining({ title: "Mock Task" })]),
    );
  });
});
