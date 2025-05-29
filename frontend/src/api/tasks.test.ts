// @ts-ignore
import { getTasks, addTask, deleteTask, Task } from "./tasks"; // adjust import path

// Mocking fetch to simulate API calls
global.fetch = jest.fn();

describe("Task API Functions", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  // Test for getTasks
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

    const result = await getTasks();
    expect(result).toEqual(mockTasks);
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8000/api/tasks",
      expect.any(Object),
    );
  });

  it("should return null if fetching tasks fails", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      json: async () => ({}),
    });

    const result = await getTasks();
    expect(result).toBeNull();
  });

  // Test for addTask
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

    const result = await addTask(newTask);
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

    const result = await addTask(newTask);
    expect(result).not.toBe(newTask);
  });

  // Test for deleteTask
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
  });
});
