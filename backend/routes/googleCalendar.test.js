const request = require("supertest");
const express = require("express");
const session = require("express-session");

// Mock googleapis before importing router
jest.mock("googleapis", () => {
  const mockOAuth2Client = {
    generateAuthUrl: jest.fn(),
    getToken: jest.fn(),
    setCredentials: jest.fn(),
  };
  const mockCalendar = {
    events: {
      list: jest.fn(),
    },
  };
  const mockTasks = {
    tasklists: { list: jest.fn() },
    tasks: { list: jest.fn() },
  };

  return {
    google: {
      auth: { OAuth2: jest.fn(() => mockOAuth2Client) },
      calendar: jest.fn(() => mockCalendar),
      tasks: jest.fn(() => mockTasks),
    },
  };
});

// Now import after mocks
const { google } = require("googleapis");
const authRouter = require("./googleCalendar");

describe("Google Auth Routes", () => {
  let app;
  let mockOAuth2Client;
  let mockCalendar;
  let mockTasks;

  beforeEach(() => {
    jest.clearAllMocks();

    app = express();
    app.use(express.json());
    app.use(
      session({
        secret: "testsecret",
        resave: false,
        saveUninitialized: true,
      }),
    );

    mockOAuth2Client = new google.auth.OAuth2();
    mockCalendar = new google.calendar();
    mockTasks = new google.tasks();
  });

  test("GET /auth - should redirect to Google auth URL", async () => {
    app.use(authRouter);

    const fakeUrl = "https://fake-google-auth-url";
    mockOAuth2Client.generateAuthUrl.mockReturnValue(fakeUrl);

    const res = await request(app).get("/auth");

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe(fakeUrl);
    expect(mockOAuth2Client.generateAuthUrl).toHaveBeenCalledWith({
      access_type: "offline",
      scope: expect.any(Array),
      prompt: "consent",
    });
  });

  test("GET /status - connected true when session tokens present", async () => {
    app.use((req, res, next) => {
      req.session.tokens = { access_token: "abc" };
      next();
    });
    app.use(authRouter);

    const res = await request(app).get("/status");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ connected: true });
  });

  test("GET /status - connected false when no tokens", async () => {
    app.use(authRouter);

    const res = await request(app).get("/status");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ connected: false });
  });

  test("GET /callback - should exchange code, set tokens, and redirect", async () => {
    app.use(authRouter);

    const fakeTokens = { access_token: "abc", refresh_token: "def" };
    mockOAuth2Client.getToken.mockResolvedValue({ tokens: fakeTokens });
    mockOAuth2Client.setCredentials.mockReturnValue();

    const res = await request(app)
      .get("/callback")
      .query({ code: "fake-code" });

    expect(mockOAuth2Client.getToken).toHaveBeenCalledWith("fake-code");
    expect(mockOAuth2Client.setCredentials).toHaveBeenCalledWith(fakeTokens);
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe("http://localhost:5173/Calendar");
  });

  test("GET /callback - error handling returns 500", async () => {
    app.use(authRouter);

    mockOAuth2Client.getToken.mockRejectedValue(new Error("fail"));

    const res = await request(app).get("/callback").query({ code: "bad-code" });

    expect(res.status).toBe(500);
    expect(res.text).toBe("Error during Google OAuth callback");
  });

  test("GET /events - returns 401 if no tokens in session", async () => {
    app.use(authRouter);

    const res = await request(app).get("/events");

    expect(res.status).toBe(401);
    expect(res.text).toBe("Not authorized with Google");
  });

  test("GET /events - fetches and returns events", async () => {
    app.use((req, res, next) => {
      req.session.tokens = { access_token: "token" };
      next();
    });
    app.use(authRouter);

    const eventsResponse = {
      data: {
        items: [
          {
            id: "1",
            summary: "Event 1",
            description: "Desc 1",
            start: { dateTime: "2025-06-03T10:00:00Z" },
            end: { dateTime: "2025-06-03T11:00:00Z" },
          },
          {
            id: "2",
            start: { date: "2025-06-04" },
            end: { date: "2025-06-04" },
          },
        ],
        nextPageToken: null,
      },
    };

    mockCalendar.events.list.mockResolvedValue(eventsResponse);

    const res = await request(app).get("/events");

    expect(mockOAuth2Client.setCredentials).toHaveBeenCalledWith({
      access_token: "token",
    });
    expect(mockCalendar.events.list).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      {
        id: "1",
        title: "Event 1",
        description: "Desc 1",
        start: "2025-06-03T10:00:00Z",
        end: "2025-06-03T11:00:00Z",
      },
      {
        id: "2",
        title: "(No title)",
        description: "",
        start: "2025-06-04",
        end: "2025-06-04",
      },
    ]);
  });

  test("GET /tasks - returns 401 if no tokens", async () => {
    app.use(authRouter);

    const res = await request(app).get("/tasks");

    expect(res.status).toBe(401);
    expect(res.text).toBe("Not authorized with Google");
  });

  test("GET /tasks - fetches and returns tasks", async () => {
    app.use((req, res, next) => {
      req.session.tokens = { access_token: "token" };
      next();
    });
    app.use(authRouter);

    mockTasks.tasklists.list.mockResolvedValue({
      data: {
        items: [
          { id: "list1", title: "List 1" },
          { id: "list2", title: "List 2" },
        ],
      },
    });

    mockTasks.tasks.list
      .mockResolvedValueOnce({
        data: {
          items: [
            {
              id: "task1",
              title: "Task 1",
              due: "2025-06-05T12:00:00Z",
              notes: "Notes 1",
            },
          ],
        },
      })
      .mockResolvedValueOnce({
        data: {
          items: [{ id: "task2", title: "Task 2", due: null, notes: null }],
        },
      });

    const res = await request(app).get("/tasks");

    expect(mockOAuth2Client.setCredentials).toHaveBeenCalledWith({
      access_token: "token",
    });
    expect(mockTasks.tasklists.list).toHaveBeenCalled();
    expect(mockTasks.tasks.list).toHaveBeenCalledTimes(2);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      {
        id: "task1",
        title: "Task 1",
        due: "2025-06-05T12:00:00Z",
        notes: "Notes 1",
        taskList: "List 1",
      },
      {
        id: "task2",
        title: "Task 2",
        due: null,
        notes: null,
        taskList: "List 2",
      },
    ]);
  });

  test("GET /tasks - handles error and returns 500", async () => {
    app.use((req, res, next) => {
      req.session.tokens = { access_token: "token" };
      next();
    });
    app.use(authRouter);

    mockTasks.tasklists.list.mockRejectedValue(new Error("fail"));

    const res = await request(app).get("/tasks");

    expect(res.status).toBe(500);
    expect(res.text).toBe("Failed to fetch Google Tasks");
  });
});
