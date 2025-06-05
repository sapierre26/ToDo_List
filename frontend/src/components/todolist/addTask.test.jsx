import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddTask from "./addTask";
import * as api from "../../api/tasks"; // mock this
import "@testing-library/jest-dom";

// MOCK API
jest.mock("../../api/tasks", () => ({
  addTask: jest.fn(),
}));

describe("AddTask Component", () => {
  const onTaskAdded = jest.fn();
  const onClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the form correctly", () => {
    render(<AddTask onTaskAdded={onTaskAdded} onClose={onClose} />);
    expect(screen.getByText("Add Task")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Title")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Description")).toBeInTheDocument();
  });

  it("prefills date when taskDate prop is provided", () => {
    const taskDate = new Date("2025-06-01");
    render(<AddTask taskDate={taskDate} onTaskAdded={onTaskAdded} onClose={onClose} />);
    expect(screen.getByDisplayValue("2025-06-01")).toBeInTheDocument();
  });

  it("changes form fields correctly", () => {
    render(<AddTask onTaskAdded={onTaskAdded} onClose={onClose} />);

    fireEvent.change(screen.getByPlaceholderText("Title"), { target: { value: "Test Title" } });
    fireEvent.change(screen.getByPlaceholderText("Description"), { target: { value: "Test Desc" } });

    expect(screen.getByDisplayValue("Test Title")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test Desc")).toBeInTheDocument();
  });

  it("switches label between Task and Event", () => {
    render(<AddTask onTaskAdded={onTaskAdded} onClose={onClose} />);
    fireEvent.click(screen.getByText("Event"));
    expect(screen.getByText("Add Event")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Task"));
    expect(screen.getByText("Add Task")).toBeInTheDocument();
  });

  it("prevents submission when required fields are missing", async () => {
    render(<AddTask onTaskAdded={onTaskAdded} onClose={onClose} />);
    fireEvent.click(screen.getByText(/Submit Task/i));
    await waitFor(() => {
      expect(onTaskAdded).not.toHaveBeenCalled();
    });
  });

  it("calls onClose when close button clicked", () => {
    render(<AddTask onTaskAdded={onTaskAdded} onClose={onClose} />);
    fireEvent.click(screen.getByText("×"));
    expect(onClose).toHaveBeenCalled();
  });
});
