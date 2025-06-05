import {
  getTasks,
  addTask,
  deleteTask,
  getTasksAndEventsByEndDate,
  getTasksForMonth,
  updateTask,
  getGoogleCalendarEvents,
  getGoogleTasks,
} from "./tasks";

// Mocking fetch to simulate API calls
global.fetch = jest.fn();

describe("Task API Functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Test for getTasks
  describe("getTasks", () => {
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

      const token = "undefined";
      const result = await getTasks(token);
      expect(result).toEqual(mockTasks);
      expect(fetch).toHaveBeenCalledWith("http://localhost:8000/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    });

    test("should return null if fetching tasks fails", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        json: async () => ({}),
      });
      const token = "undefined";
      const result = await getTasks(token);
      expect(result).toBeNull();
    });
  });

  // Test for addTask
  describe("addTask", () => {
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
      });
      const token = "undefined";
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
    });

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
      const token = "undefined";
      const result = await addTask(newTask, token);
      expect(result).not.toBe(newTask);
    });
  });

  // Test for deleteTask
  describe("deleteTask", () => {
    it("should successfully delete a task", async () => {
      const mockResponse = { message: "Task deleted" };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await deleteTask("1");
      expect(result).toBe(true);
      expect(fetch).toHaveBeenCalledWith("http://localhost:8000/api/tasks/1", {
        method: "DELETE",
        headers: {
          Authorization: "Bearer undefined",
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });
    });

    it("should return false if deleting a task fails", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ message: "Error deleting task" }),
      });

      const result = await deleteTask("1");
      expect(result).toBe(false);
    });
  });

  // Test for getTasksForMonth
  describe("getTasksForMonth", () => {
    it("should fetch tasks for month", async () => {
      const mockData = [{ title: "Monthly Task" }];
      fetch.mockResolvedValueOnce({ ok: true, json: async () => mockData });

      const result = await getTasksForMonth(
        new Date("2025-06-01"),
        new Date("2025-06-30"),
        "token",
      );
      expect(result).toEqual(mockData);
    });

    it("should handle error for month fetch", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({}),
      });
      const result = await getTasksForMonth(
        new Date("2025-06-01"),
        new Date("2025-06-30"),
        "token",
      );
      expect(result).toBeNull();
    });
  });

  // Test for getTasksAndEventsByEndDate
  describe("getTasksAndEventsByEndDate", () => {
    it("should fetch tasks by date", async () => {
      const mockData = [{ title: "Task 1" }];
      fetch.mockResolvedValueOnce({ ok: true, json: async () => mockData });

      const result = await getTasksAndEventsByEndDate(
        new Date("2025-06-04"),
        "token",
      );
      expect(result).toEqual(mockData);
    });

    it("should handle error when fetching by date", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({}),
      });
      const result = await getTasksAndEventsByEndDate(
        new Date("2025-06-04"),
        "token",
      );
      expect(result).toBeNull();
    });
  });

  // Test for getGoogleCalendarEvents
  describe("getGoogleCalendarEvents", () => {
    it("should fetch Google Calendar events", async () => {
      const events = [{ id: "1", summary: "Event 1" }];
      fetch.mockResolvedValueOnce({ ok: true, json: async () => events });
      const result = await getGoogleCalendarEvents();
      expect(result).toEqual(events);
    });

    it("should handle Google Calendar events fetch failure", async () => {
      fetch.mockResolvedValueOnce({ ok: false });
      const result = await getGoogleCalendarEvents();
      expect(result).toEqual([]);
    });
  });

  //Test for getGoogleTasks
  describe("getGoogleTasks", () => {
    it("should fetch Google Tasks", async () => {
      const tasks = [{ id: "1", title: "Google Task 1" }];
      fetch.mockResolvedValueOnce({ ok: true, json: async () => tasks });
      const result = await getGoogleTasks();
      expect(result).toEqual(tasks);
    });

    it("should handle Google Tasks fetch failure", async () => {
      fetch.mockResolvedValueOnce({ ok: false });
      await expect(getGoogleTasks()).rejects.toThrow(
        "Failed to fetch Google Tasks",
      );
    });
  });

  // Test for updateTask
  describe("updateTask", () => {
    it("should update task successfully", async () => {
      const updatedTask = { title: "Updated Task" };
      fetch.mockResolvedValueOnce({ ok: true, json: async () => updatedTask });

      const result = await updateTask("1", { title: "Updated Task" }, "token");
      expect(result).toEqual(updatedTask);
    });

    it("should handle update failure with error message", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        text: async () => "Error message",
      });

      const result = await updateTask("1", { title: "Updated Task" }, "token");
      expect(result).toBeNull();
    });
  });
});
