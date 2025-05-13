import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import CalendarComponent from "./page";
import "@testing-library/jest-dom";
import { afterEach, beforeEach } from "jest";

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Render CalendarComponent before each test
beforeEach(() => {
  render(<CalendarComponent />);
});

describe("PriorityFilterSidebar Tests", () => {
  test("Mock the high priority", () => {
    const highPriority = screen.getByText("High");
    fireEvent.click(highPriority);
  });

  test("Mock the low priority", () => {
    const lowPriority = screen.getByText("Low");
    fireEvent.click(lowPriority);
  });

  test("Mock the medium priority", () => {
    const mediumPriority = screen.getByText("Medium");
    fireEvent.click(mediumPriority);
  });
});

describe("CalendarComponent Tests", () => {
  test("renders CalendarComponent without crashing", () => {
    expect(screen.getByText(/Today/i)).toBeInTheDocument();
  });

  test("-> button click navigates to next", () => {
    const nextButton = screen.getByText("→");
    fireEvent.click(nextButton);
  });

  test("<- button clickable", () => {
    const prevButton = screen.getByText("←");
    fireEvent.click(prevButton);
  });

  test("Month navigates to month view and month button clickable", () => {
    const month = screen.getByText("Month");
    fireEvent.click(month);
    expect(document.querySelector(".rbc-month-view")).toBeInTheDocument();
  });

  test("Week navigates to week view and week button clickable", () => {
    const week = screen.getByText("Week");
    fireEvent.click(week);
    expect(document.querySelector(".rbc-time-view")).toBeInTheDocument();
  });

  test("Day navigates to day view and day button clickable", () => {
    const day = screen.getByText("Day");
    fireEvent.click(day);
    expect(day).toBeInTheDocument();
  });

  test("Monthly date cells selectable", () => {
    const dateCells = screen.getAllByRole("cell");
    fireEvent.click(dateCells[5]);
    expect(document.querySelector(".rbc-button-link")).toBeInTheDocument();
  });

  test("Today Button Clickable", () => {
    fireEvent.click(screen.getByText("Today"));
    expect(document.getElementById("da8vorr"));
  });
});
