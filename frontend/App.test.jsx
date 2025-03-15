import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";

// Utility function to render the App component inside a Router
const renderApp = () => {
  return render(
    <Router>
      <App />
    </Router>
  );
};

describe("App Component", () => {
  test("renders navigation links", () => {
    renderApp();

    // Check if the navigation links are rendered
    const calendarLink = screen.getByText(/Calendar/i);
    const todoListLink = screen.getByText(/Todo List/i);
    const loginLink = screen.getByText(/Login/i);
    const createAccountLink = screen.getByText(/Create Account/i);

    expect(calendarLink).toBeInTheDocument();
    expect(todoListLink).toBeInTheDocument();
    expect(loginLink).toBeInTheDocument();
    expect(createAccountLink).toBeInTheDocument();
  });

  test("renders Calendar component when Calendar link is clicked", () => {
    renderApp();

    // Click on the Calendar link
    fireEvent.click(screen.getByText(/Calendar/i));

    // Check if the CalendarComponent is rendered
    expect(screen.getByText(/Calendar/i)).toBeInTheDocument(); // You can change this to a more specific element or text inside the CalendarComponent
  });

  test("renders Todo List component when Todo List link is clicked", () => {
    renderApp();

    // Click on the Todo List link
    fireEvent.click(screen.getByText(/Todo List/i));

    // Check if the MyApp component is rendered
    expect(screen.getByText(/Todo List/i)).toBeInTheDocument(); // Again, change this based on what is unique in MyApp
  });

  test("renders Login component when Login link is clicked", () => {
    renderApp();

    // Click on the Login link
    fireEvent.click(screen.getByText(/Login/i));

    // Check if the Login component is rendered
    expect(screen.getByText(/Login/i)).toBeInTheDocument(); // You can adjust this to something more specific in Login
  });

  test("renders Create Account component when Create Account link is clicked", () => {
    renderApp();

    // Click on the Create Account link
    fireEvent.click(screen.getByText(/Create Account/i));

    // Check if the Create Account component is rendered
    expect(screen.getByText(/Create Account/i)).toBeInTheDocument(); // Adjust as necessary
  });
});
