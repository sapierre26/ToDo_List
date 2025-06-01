import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Table from "./page";
import "@testing-library/jest-dom";

describe("Table Component", () => {
  const mockTasks = [
    {
      id: 1,
      description: "Complete project",
      priority: "High",
      dueDate: "2023-06-15",
      status: "Pending",
    },
    {
      id: 2,
      description: "Review code",
      priority: "Medium",
      dueDate: "2023-06-10",
      status: "Completed",
    },
  ];

  const mockToggleStatus = jest.fn();
  const mockDeleteTask = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders table with correct structure", () => {
    render(
      <Table
        tasks={mockTasks}
        toggleStatus={mockToggleStatus}
        deleteTask={mockDeleteTask}
      />,
    );

    // Verify table structure
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getAllByRole("rowgroup")).toHaveLength(2); // thead and tbody
    expect(screen.getAllByRole("row")).toHaveLength(3); // header + 2 tasks
  });

  test("displays correct headers", () => {
    render(
      <Table
        tasks={mockTasks}
        toggleStatus={mockToggleStatus}
        deleteTask={mockDeleteTask}
      />,
    );

    expect(screen.getByText("Task")).toBeInTheDocument();
    expect(screen.getByText("Priority")).toBeInTheDocument();
    expect(screen.getByText("Due Date")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  test("renders all tasks with correct data", () => {
    render(
      <Table
        tasks={mockTasks}
        toggleStatus={mockToggleStatus}
        deleteTask={mockDeleteTask}
      />,
    );

    // Verify first task
    expect(screen.getByText("Complete project")).toBeInTheDocument();
    expect(screen.getByText("High")).toBeInTheDocument();
    expect(screen.getByText("2023-06-15")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();

    // Verify second task
    expect(screen.getByText("Review code")).toBeInTheDocument();
    expect(screen.getByText("Medium")).toBeInTheDocument();
    expect(screen.getByText("2023-06-10")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  test("renders correct action buttons based on status", () => {
    render(
      <Table
        tasks={mockTasks}
        toggleStatus={mockToggleStatus}
        deleteTask={mockDeleteTask}
      />,
    );

    expect(screen.getByText("Complete")).toBeInTheDocument();

    expect(screen.getByText("Undo")).toBeInTheDocument();

    expect(screen.getAllByText("Delete")).toHaveLength(2);
  });

  test("calls toggleStatus with correct id when action button clicked", () => {
    render(
      <Table
        tasks={mockTasks}
        toggleStatus={mockToggleStatus}
        deleteTask={mockDeleteTask}
      />,
    );

    fireEvent.click(screen.getByText("Complete"));
    expect(mockToggleStatus).toHaveBeenCalledWith(1);

    fireEvent.click(screen.getByText("Undo"));
    expect(mockToggleStatus).toHaveBeenCalledWith(2);
  });

  test("calls deleteTask with correct id when delete button clicked", () => {
    render(
      <Table
        tasks={mockTasks}
        toggleStatus={mockToggleStatus}
        deleteTask={mockDeleteTask}
      />,
    );

    const deleteButtons = screen.getAllByText("Delete");
    fireEvent.click(deleteButtons[0]);
    expect(mockDeleteTask).toHaveBeenCalledWith(1);

    fireEvent.click(deleteButtons[1]);
    expect(mockDeleteTask).toHaveBeenCalledWith(2);
  });

  test("handles empty tasks array gracefully", () => {
    render(
      <Table
        tasks={[]}
        toggleStatus={mockToggleStatus}
        deleteTask={mockDeleteTask}
      />,
    );

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(1);
  });
});
