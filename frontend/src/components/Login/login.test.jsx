/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from "@testing-library/react";
import { beforeEach } from "@jest/globals";
import Login from "./page";
import { act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

describe("Login Component Tests", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );
  });

  test("1. The Login Button should be present", () => {
    const loginButton = screen.getByRole("button", { name: /Login/i });
    expect(loginButton).toBeInTheDocument();
  });

  test("2. Error message for empty credentials", async () => {
    const loginButton = screen.getByRole("button", { name: /Login/i });
    await act(async () => {
      fireEvent.click(loginButton);
    });

    expect(screen.getByText("Please enter your username")).toBeInTheDocument();
    expect(screen.queryByText("Please enter a password")).toBeInTheDocument();
  });

  test("3. Password error with empty username credentials", async () => {
    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "testuser" },
    });
    const loginButton = screen.getByRole("button", { name: /Login/i });
    await act(async () => {
      fireEvent.click(loginButton);
    });

    expect(
      screen.queryByText("Please enter your username"),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Please enter a password")).toBeInTheDocument();
  });

  test("4. Username error with empty password credentials", async () => {
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "testpassword" },
    });
    const loginButton = screen.getByRole("button", { name: /Login/i });
    await act(async () => {
      fireEvent.click(loginButton);
    });

    expect(
      screen.queryByText("Please enter a password"),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Please enter your username")).toBeInTheDocument();
  });

  test("5. No errors shown", async () => {
    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "testpassword" },
    });

    const loginButton = screen.getByRole("button", { name: /Login/i });

    await act(async () => {
      fireEvent.click(loginButton);
    });

    expect(
      screen.queryByText("Please enter your username"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Please enter a password"),
    ).not.toBeInTheDocument();
  });
});
