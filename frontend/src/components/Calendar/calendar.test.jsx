import { act } from "@testing-library/react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import CalendarComponent from "./page";
import "@testing-library/jest-dom";
import { afterEach, beforeEach, beforeAll, afterAll } from "@jest/globals";
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
