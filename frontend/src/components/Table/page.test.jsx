import { render, screen, fireEvent } from "@testing-library/react";
import Table from "./page";
import "@testing-library/jest-dom";

// Sample tasks to test with
const mockTasks = [
  {
    id: 1,
    description: "Task 1",
    priority: "High",
    dueDate: "2025-03-20",
    status: "Pending",
  },
  {
    id: 2,
    description: "Task 2",
    priority: "Medium",
    dueDate: "2025-03-21",
    status: "Completed",
  },
];

const mockToggleStatus = jest.fn();
const mockDeleteTask = jest.fn();

describe("Table Component", () => {
  test("renders table with correct headers", () => {
    render(
      <Table
        tasks={mockTasks}
        toggleStatus={mockToggleStatus}
        deleteTask={mockDeleteTask}
      />,
    );

    // Check if the table headers are rendered correctly
    expect(screen.getAllByText(/Task/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/Priority/i)).toBeInTheDocument();
    expect(screen.getByText(/Due Date/i)).toBeInTheDocument();
    expect(screen.getByText(/Status/i)).toBeInTheDocument();
    expect(screen.getByText(/Actions/i)).toBeInTheDocument();
  });

  test("renders table rows with correct task data", () => {
    render(
      <Table
        tasks={mockTasks}
        toggleStatus={mockToggleStatus}
        deleteTask={mockDeleteTask}
      />,
    );

    // Check if the task data is rendered in the table rows
    expect(screen.getByText(/Task 1/i)).toBeInTheDocument();
    expect(screen.getByText(/High/i)).toBeInTheDocument();
    expect(screen.getByText(/2025-03-20/i)).toBeInTheDocument();
    expect(screen.getByText(/Pending/i)).toBeInTheDocument();

    expect(screen.getByText(/Task 2/i)).toBeInTheDocument();
    expect(screen.getByText(/Medium/i)).toBeInTheDocument();
    expect(screen.getByText(/2025-03-21/i)).toBeInTheDocument();
    expect(screen.getByText(/Completed/i)).toBeInTheDocument();
  });

  test("calls toggleStatus function when Complete/Undo button is clicked", () => {
    render(
      <Table
        tasks={mockTasks}
        toggleStatus={mockToggleStatus}
        deleteTask={mockDeleteTask}
      />,
    );

    // Click on the "Complete" button for Task 1
    fireEvent.click(screen.getAllByText(/Complete/i)[0]);

    // Check if toggleStatus is called with the correct task ID
    expect(mockToggleStatus).toHaveBeenCalledWith(1);

    // Click on the "Undo" button for Task 2
    fireEvent.click(screen.getByText(/Undo/i));

    // Check if toggleStatus is called with the correct task ID
    expect(mockToggleStatus).toHaveBeenCalledWith(2);
  });

  test("calls deleteTask function when Delete button is clicked", () => {
    render(
      <Table
        tasks={mockTasks}
        toggleStatus={mockToggleStatus}
        deleteTask={mockDeleteTask}
      />,
    );

    // Click on the "Delete" button for Task 1
    fireEvent.click(screen.getAllByText(/Delete/i)[0]);

    // Check if deleteTask is called with the correct task ID
    expect(mockDeleteTask).toHaveBeenCalledWith(1);

    // Click on the "Delete" button for Task 2
    fireEvent.click(screen.getAllByText(/Delete/i)[1]);

    // Check if deleteTask is called with the correct task ID
    expect(mockDeleteTask).toHaveBeenCalledWith(2);
  });
});
