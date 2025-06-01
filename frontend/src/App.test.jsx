import App from "./App";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock child components to simplify testing
jest.mock("./components/Calendar/page", () => () => (
  <div>Calendar Component</div>
));
jest.mock("./components/todolist/page", () => () => (
  <div>TodoList Component</div>
));
jest.mock("./components/Login/page", () => ({ onLoginSuccess }) => (
  <div>
    Login Component
    <button onClick={onLoginSuccess}>Mock Login</button>
  </div>
));
jest.mock("./components/CreateAccount/page", () => () => (
  <div>CreateAccount Component</div>
));

// Mock localStorage
const localStorageMock = (function () {
  let store = {};
  return {
    getItem: function (key) {
      return store[key] || null;
    },
    setItem: function (key, value) {
      store[key] = value.toString();
    },
    removeItem: function (key) {
      delete store[key];
    },
    clear: function () {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("App Component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("renders Login component by default when not authenticated", () => {
    render(<App />);
    expect(screen.getByText("Login Component")).toBeInTheDocument();
  });

  test("renders navigation links when authenticated", async () => {
    // Set up a valid token
    const fakePayload = { exp: Math.floor(Date.now() / 1000) + 60 * 60 };
    const token = `header.${btoa(JSON.stringify(fakePayload))}.sig`;
    localStorage.setItem("token", token);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Calendar/i)).toBeInTheDocument();
      expect(screen.getByText(/Todo List/i)).toBeInTheDocument();
    });
  });

  test("navigates to Calendar when clicking Calendar link after login", async () => {
    render(<App />);

    // Mock login
    fireEvent.click(screen.getByText("Mock Login"));

    await waitFor(() => {
      fireEvent.click(screen.getByText(/Calendar/i));
      expect(screen.getByText("Calendar Component")).toBeInTheDocument();
    });
  });

  test("navigates to Todo List when clicking Todo List link after login", async () => {
    render(<App />);

    // Mock login
    fireEvent.click(screen.getByText("Mock Login"));

    await waitFor(() => {
      fireEvent.click(screen.getByText(/Todo List/i));
      expect(screen.getByText("TodoList Component")).toBeInTheDocument();
    });
  });
});
