import { act } from "@testing-library/react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import CalendarComponent from "./page";
import "@testing-library/jest-dom";
import { afterEach, beforeEach, beforeAll, afterAll } from "@jest/globals";
import {
  getTasksForMonth,
  getGoogleCalendarEvents,
  getGoogleTasks,
} from "../../api/tasks";

jest.mock("../../api/tasks", () => ({
  getTasksForMonth: jest.fn(() => Promise.resolve([])),
  getGoogleCalendarEvents: jest.fn(() => Promise.resolve([])),
  getGoogleTasks: jest.fn(() => Promise.resolve([])),
  getTasksAndEventsByEndDate: jest.fn(() => Promise.resolve([])),
}));

beforeAll(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([]),
    }),
  );
});

afterAll(() => {
  global.fetch.mockClear();
  delete global.fetch;
});

afterEach(() => {
  cleanup();
});

beforeEach(async () => {
  await act(async () => {
    render(
      <CalendarComponent
        selectedPriority={"Low"}
        onSelectPriority={jest.fn()}
      />,
    );
  });
});

describe("PriorityFilterSidebar Tests", () => {
  test("Mock the high priority", async () => {
    const highPriority = screen.getByText("High");
    await act(async () => {
      fireEvent.click(highPriority);
    });
  });

  test("Mock the low priority", async () => {
    const lowPriority = screen.getByText("Low");
    await act(async () => {
      fireEvent.click(lowPriority);
    });
  });

  test("Mock the medium priority", async () => {
    const mediumPriority = screen.getByText("Medium");
    await act(async () => {
      fireEvent.click(mediumPriority);
    });
  });
});

describe("CalendarComponent Tests", () => {
  test("renders CalendarComponent without crashing", async () => {
    expect(screen.getByText(/Today/i)).toBeInTheDocument();
  });

  test("-> button click navigates to next", async () => {
    const nextButton = screen.getByText("→");
    await act(async () => {
      fireEvent.click(nextButton);
    });
  });

  test("<- button clickable", async () => {
    const prevButton = screen.getByText("←");
    await act(async () => {
      fireEvent.click(prevButton);
    });
  });

  test("Month navigates to month view and month button clickable", async () => {
    const month = screen.getByText("Month");
    await act(async () => {
      fireEvent.click(month);
    });

    expect(document.querySelector(".rbc-month-view")).toBeInTheDocument();
  });

  test("Week navigates to week view and week button clickable", async () => {
    const week = screen.getByText("Week");
    await act(async () => {
      fireEvent.click(week);
    });

    expect(document.querySelector(".rbc-time-view")).toBeInTheDocument();
  });

  test("Monthly date cells selectable", async () => {
    const dateCells = screen.getAllByRole("cell");
    await act(async () => {
      fireEvent.click(dateCells[5]);
    });

    expect(document.querySelector(".rbc-button-link")).toBeInTheDocument();
  });

  test("Today Button Clickable", async () => {
    await act(async () => {
      fireEvent.click(screen.getByText("Today"));
    });

    expect(document.getElementById("da8vorr"));
  });
});

describe("Task and Google Tasks", () => {
  test("Displays 'No tasks for this date' when dailyTasks is empty", () => {
    const emptyTaskDate = screen.getByText(/No tasks for this date/i);
    expect(emptyTaskDate).toBeInTheDocument();
  });

  test("shows Import button when Google not connected", () => {
    expect(screen.getByText("Import")).toBeInTheDocument();
  });

  test("filters events by selected priority", async () => {
    getTasksForMonth.mockResolvedValue([
      {
        _id: "1",
        title: "High Priority Task",
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        label: "Task",
        priority: "High",
      },
      {
        _id: "2",
        title: "Low Priority Task",
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        label: "Task",
        priority: "Low",
      },
    ]);

    await act(async () => {
      render(<CalendarComponent />);
    });

    const highPriorityButton = screen.getAllByText("High")[0];
    await act(async () => {
      fireEvent.click(highPriorityButton);
    });

    expect(screen.getByText("High Priority Task")).toBeInTheDocument();
  });

  test("fetches and displays tasks/events correctly", async () => {
    getTasksForMonth.mockResolvedValue([
      {
        _id: "1",
        title: "My Task",
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        label: "Task",
        priority: "High",
      },
    ]);
    getGoogleCalendarEvents.mockResolvedValue([
      {
        id: "g1",
        title: "Google Event",
        start: new Date().toISOString(),
        end: new Date().toISOString(),
      },
    ]);
    getGoogleTasks.mockResolvedValue([
      {
        id: "gt1",
        title: "Google Task",
        due: new Date().toISOString(),
        notes: "Google Notes",
      },
    ]);
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ connected: true }),
    });
    await act(async () => {
      render(<CalendarComponent />);
    });
    expect(screen.getAllByText("My Task")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Google Event")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Google Task")[0]).toBeInTheDocument();
  });

  test("filters out Google tasks without due date", async () => {
    getGoogleTasks.mockResolvedValue([
      { id: "1", title: "Undated Google Task" },
    ]);
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ connected: true }),
    });
    await act(async () => {
      render(<CalendarComponent />);
    });
    expect(screen.queryByText("Undated Google Task")).not.toBeInTheDocument();
  });

  test("correctly maps fetched tasks into events", async () => {
    getTasksForMonth.mockResolvedValue([
      {
        _id: "123",
        title: "Mapped Task",
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        label: "Task",
        priority: "Low",
      },
    ]);
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ connected: false }),
    });
    await act(async () => {
      render(<CalendarComponent />);
    });
    expect(screen.getByText("Mapped Task")).toBeInTheDocument();
  });

  test("view changes correctly", async () => {
    await act(async () => {
      render(<CalendarComponent />);
    });
    fireEvent.click(screen.getAllByText("Week")[0]);
    expect(document.querySelector(".rbc-time-view")).toBeInTheDocument();
  });
});
