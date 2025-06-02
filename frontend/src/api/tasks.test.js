<<<<<<< HEAD:frontend/src/api/tasks.test.ts
///// <reference types="jest" />
import { getTasks, addTask, deleteTask, Task} from "./tasks"; // adjust import path
=======
const { getTasks, addTask, deleteTask } = require("./tasks");
>>>>>>> refs/remotes/origin/main:frontend/src/api/tasks.test.js

// Mocking fetch to simulate API calls
global.fetch = jest.fn() as jest.Mock;

describe("Task API Functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Test for getTasks
<<<<<<< HEAD:frontend/src/api/tasks.test.ts
  describe("getTasks", () => {
    it("should fetch all tasks successfully", async () => {
      const mockTasks: Task[] = [
        {
          _id: "1",
          date: "2025-03-14",
          title: "Task 1",
          label: "Work",
          priority: "High",
        },
        {
          _id: "2",
          date: "2025-03-15",
          title: "Task 2",
          label: "Personal",
          priority: "Low",
        },
      ];

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTasks,
      });
      
      const token = "testToken123";
      const result = await getTasks(token);
      expect(result).toEqual(mockTasks);
      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:8000/api/tasks",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    });

    it("should return null if fetching tasks fails", async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        json: async () => ({}),
      });
      const token = "testToken123";
      const result = await getTasks(token);
      expect(result).toBeNull();
=======
  it("should fetch all tasks successfully", async () => {
    const mockTasks = [
      {
        _id: "1",
        date: "2025-03-14",
        title: "Task 1",
        label: "Work",
        priority: "High",
      },
      {
        _id: "2",
        date: "2025-03-15",
        title: "Task 2",
        label: "Personal",
        priority: "Low",
      },
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockTasks,
    });

    const result = await getTasks();
    expect(result).toEqual(mockTasks);
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8000/api/tasks",
      expect.any(Object),
    );
  });

  it("should return null if fetching tasks fails", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      json: async () => ({}),
>>>>>>> refs/remotes/origin/main:frontend/src/api/tasks.test.js
    });
  });

  // Test for addTask
<<<<<<< HEAD:frontend/src/api/tasks.test.ts
  describe("addTask", () => {
    it("should successfully add a task", async () => {
      const newTask: Task = {
        _id: "3",
        date: "2025-03-16",
        title: "Task 3",
        label: "Work",
        priority: "Medium",
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => newTask,
      });
      const token = "testToken123";
      const result = await addTask(newTask, token);
      const mockToken = "undefined";
      expect(result).toBe(newTask);
      expect(fetch).toHaveBeenCalledWith("http://localhost:8000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${mockToken}`,
        },
        body: JSON.stringify(newTask),
        cache: "no-store",
      });
=======
  it("should successfully add a task", async () => {
    const newTask = {
      _id: "3",
      date: "2025-03-16",
      title: "Task 3",
      label: "Work",
      priority: "Medium",
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => newTask,
>>>>>>> refs/remotes/origin/main:frontend/src/api/tasks.test.js
    });

    it("should return false if adding a task fails", async () => {
      const newTask: Task = {
        _id: "3",
        date: "2025-03-16",
        title: "Task 3",
        label: "Work",
        priority: "Medium",
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ message: "Bad request" }),
      });
      const token = "testToken123"
      const result = await addTask(newTask, token);
      expect(result).not.toBe(newTask);
    });
  });

<<<<<<< HEAD:frontend/src/api/tasks.test.ts
  // Test for deleteTask
  describe("deleteTask", () => {
    it("should successfully delete a task", async () => {
      const mockResponse = { message: "Task deleted" };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

      const result = await deleteTask("1");
      expect(result).toBe(true);
      expect(fetch).toHaveBeenCalledWith("http://localhost:8000/api/tasks/1", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });
    });

    it("should return false if deleting a task fails", async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ message: "Error deleting task" }),
      });

      const result = await deleteTask("1");
      expect(result).toBe(false);
=======
  it("should return false if adding a task fails", async () => {
    const newTask = {
      _id: "3",
      date: "2025-03-16",
      title: "Task 3",
      label: "Work",
      priority: "Medium",
    };

    fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ message: "Bad request" }),
    });

    const result = await addTask(newTask);
    expect(result).not.toBe(newTask);
  });

  // Test for deleteTask
  it("should successfully delete a task", async () => {
    const mockResponse = { message: "Task deleted" };
    const mockToken = "test-token";

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await deleteTask("1", mockToken);
    expect(result).toBe(true);
    expect(fetch).toHaveBeenCalledWith("http://localhost:8000/api/tasks/1", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${mockToken}`,
      },
      cache: "no-store",
    });
  });

  it("should return false if deleting a task fails", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ message: "Error deleting task" }),
>>>>>>> refs/remotes/origin/main:frontend/src/api/tasks.test.js
    });
  });
});
