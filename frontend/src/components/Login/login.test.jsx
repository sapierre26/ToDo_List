import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { beforeEach } from "@jest/globals";
import Login from "./page";

describe("Login Component Tests", () => {
  beforeEach(() => {
    render(<Login />);
  });

  test("1. The Login Button should be present", () => {
    const loginButton = screen.getByRole("button", { name: /Login/i });
    expect(loginButton).toBeInTheDocument();
  });

  test("2. Error message for empty credentials", () => {
    const loginButton = screen.getByRole("button", { name: /Login/i });
    fireEvent.click(loginButton);

    expect(screen.getByText("Please enter your username")).toBeInTheDocument();
    expect(
      screen.queryByText("Please enter a password"),
    ).not.toBeInTheDocument();
  });

  test("3. Password error with empty username credentials", () => {
    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "testuser" },
    });
    const loginButton = screen.getByRole("button", { name: /Login/i });
    fireEvent.click(loginButton);

    expect(
      screen.queryByText("Please enter your username"),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Please enter a password")).toBeInTheDocument();
  });

  test("4. Username error with empty password credentials", () => {
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "testpassword" },
    });
    const loginButton = screen.getByRole("button", { name: /Login/i });
    fireEvent.click(loginButton);

    expect(
      screen.queryByText("Please enter a password"),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Please enter your username")).toBeInTheDocument();
  });

  test("5. No errors shown", () => {
    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "testpassword" },
    });

    const loginButton = screen.getByRole("button", { name: /Login/i });
    fireEvent.click(loginButton);

    expect(
      screen.queryByText("Please enter your username"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Please enter a password"),
    ).not.toBeInTheDocument();
  });
});
