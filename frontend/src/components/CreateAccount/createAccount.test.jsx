import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CreateAccount from "./page";
import { act } from "@testing-library/react";
import { describe, test, beforeEach, expect } from "@jest/globals";

describe("createAccount Component Test", () => {
  beforeEach(() => {
    render(<CreateAccount />);
  });

  test("1. Create an account button should be present", () => {
    const createAnAccountButton = screen.getByRole("button", {
      name: /Create an account/i,
    });
    expect(createAnAccountButton).toBeInTheDocument();
  });

  test("2. Error message for empty credentials on click", () => {
    const createAnAccountButton = screen.getByRole("button", {
      name: /Create an account/i,
    });
    fireEvent.click(createAnAccountButton);

    expect(screen.getByText("All fields are required.")).toBeInTheDocument();
  });

  test("3. No error message when credentials are filled", async () => {
    fireEvent.change(screen.getByPlaceholderText("First name"), {
      target: { value: "testfirstName" },
    });
    fireEvent.change(screen.getByPlaceholderText("Last name"), {
      target: { value: "testlastName" },
    });
    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "testusername" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "testpassword" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "testemail@sdd" },
    });

    const createAnAccountButton = screen.getByRole("button", {
      name: /Create an account/i,
    });

    await act(async () => {
      fireEvent.click(createAnAccountButton);
    });

    expect(
      screen.queryByText("All fields are required."),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Please enter your first name"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Please enter a password"),
    ).not.toBeInTheDocument();
  });

  test("4. Error message for missing first name", async () => {
    fireEvent.change(screen.getByPlaceholderText("Last name"), {
      target: { value: "testlastName" },
    });

    const createAnAccountButton = screen.getByRole("button", {
      name: /Create an account/i,
    });

    await act(async () => {
      fireEvent.click(createAnAccountButton);
    });

    expect(screen.queryByText("All fields are required.")).toBeInTheDocument();
  });
});
