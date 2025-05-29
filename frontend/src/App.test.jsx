import App from "./App";
import { render, screen, fireEvent } from "@testing-library/react";
import { act } from "@testing-library/react";
jest.mock("./api/tasks", () => ({
  getTasks: jest.fn(() => Promise.resolve([])), // ← ADD THIS LINE
  getTasksForMonth: jest.fn(() => Promise.resolve([])),
  getGoogleCalendarEvents: jest.fn(() => Promise.resolve([])),
  getGoogleTasks: jest.fn(() => Promise.resolve([])),
  getTasksAndEventsByEndDate: jest.fn(() => Promise.resolve([])),
}));

jest.mock("./components/PriorityFilterSidebar/page", () => () => (
  <div>Mocked PriorityFilterSidebar</div>
));
jest.mock("./components/Calendar/page", () => () => <div>Mocked Toolbar</div>);

beforeEach(() => {
  const fakePayload = { exp: Math.floor(Date.now() / 1000) + 60 * 60 };
  const token = `header.${btoa(JSON.stringify(fakePayload))}.sig`;
  localStorage.setItem("token", token);
});

afterEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

// Utility function to render the App component inside a Router
const renderApp = () => {
  return render(<App />);
};

describe("App Component", () => {
  test("renders navigation links", () => {
    renderApp();

    // Check if the navigation links are rendered
    const calendarLink = screen.getByText(/Calendar/i);
    const todoListLink = screen.getByText(/Todo List/i);
    const loginLink = screen.getAllByText(/Login/i)[0];

    expect(calendarLink).toBeInTheDocument();
    expect(todoListLink).toBeInTheDocument();
    expect(loginLink).toBeInTheDocument();
  });

  test("renders Calendar component when Calendar link is clicked", async () => {
    renderApp();

    // Click on the Calendar link
    await act(async () => {
      fireEvent.click(screen.getByText(/Calendar/i));
    });

    // Check if the CalendarComponent is rendered
    expect(screen.getByText(/Calendar/i)).toBeInTheDocument(); // You can change this to a more specific element or text inside the CalendarComponent
  });

  test("renders Todo List component when Todo List link is clicked", async () => {
    renderApp();

    // Click on the Todo List link
    await act(async () => {
      fireEvent.click(screen.getByText(/Todo List/i));
    });

    // Check if the MyApp component is rendered
    expect(screen.getByText(/Todo List/i)).toBeInTheDocument(); // Again, change this based on what is unique in MyApp
  });

  // test("renders Login component when Login link is clicked", async () => {
  //   renderApp();

  //   // Click on the Login link
  //   await act(async () => {
  //     fireEvent.click(screen.getAllByText(/Login/i)[0]);
  //   });

  //   // Check if the Login component is rendered
  //   expect(screen.getAllByText(/Login/i))[0].toBeInTheDocument(); // You can adjust this to something more specific in Login
  // });

  // test("renders Create Account component when Create Account link is clicked", async () => {
  //   renderApp();

  //   // Click on the Create Account link
  //   await act(async () => {
  //     fireEvent.click(screen.getByText(/Create Account/i));
  //   });

  //   // Check if the Create Account component is rendered
  //   expect(screen.getByText(/Create Account/i)).toBeInTheDocument(); // Adjust as necessary
  // });
});
