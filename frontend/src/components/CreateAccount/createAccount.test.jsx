import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CreateAccount from "./page";
import "@testing-library/jest-dom";

// Mock the fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ message: "Account created successfully!" }),
  }),
);

describe("CreateAccount Component", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <CreateAccount />
      </MemoryRouter>,
    );
  };

  test("renders the create account form", () => {
    renderComponent();

    expect(screen.getByText("Create an account")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("First name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Last name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Create Account/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Back to Login/i }),
    ).toBeInTheDocument();
  });

  test("shows validation errors when form is submitted empty", async () => {
    renderComponent();

    fireEvent.click(screen.getByRole("button", { name: /Create Account/i }));

    await waitFor(() => {
      const errorMessages = screen.getAllByText("This field is required.");
      expect(errorMessages).toHaveLength(5);
    });
  });

  test("shows email validation error when invalid email is entered", async () => {
    renderComponent();

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "invalid-email" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Create Account/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Please enter a valid email address."),
      ).toBeInTheDocument();
    });
  });

  test("shows password length validation error", async () => {
    renderComponent();

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "short" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Create Account/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Password must be at least 8 characters."),
      ).toBeInTheDocument();
    });
  });

  test("submits form successfully with valid data", async () => {
    renderComponent();

    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText("First name"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText("Last name"), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "johndoe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Create Account/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:8000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: "John Doe",
            username: "johndoe",
            pwd: "password123",
            email: "john@example.com",
          }),
        },
      );

      expect(
        screen.getByText("Account created successfully!"),
      ).toBeInTheDocument();
    });
  });

  test("shows error message when registration fails", async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: "Username already exists" }),
      }),
    );

    renderComponent();

    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText("First name"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText("Last name"), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "johndoe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Create Account/i }));

    await waitFor(() => {
      expect(screen.getByText("Username already exists")).toBeInTheDocument();
    });
  });

  test("disables submit button when submitting", async () => {
    renderComponent();

    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText("First name"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText("Last name"), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "johndoe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    const submitButton = screen.getByRole("button", {
      name: /Create Account/i,
    });
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent("Creating account...");

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
      expect(submitButton).toHaveTextContent("Create Account");
    });
  });

  test("clears individual field errors when typing", async () => {
    renderComponent();

    // Submit empty form to show errors
    fireEvent.click(screen.getByRole("button", { name: /Create Account/i }));

    await waitFor(() => {
      expect(screen.getAllByText("This field is required.")).toHaveLength(5);
    });

    // Type in first name field
    fireEvent.change(screen.getByPlaceholderText("First name"), {
      target: { value: "J" },
    });

    await waitFor(() => {
      expect(
        screen.queryByText("This field is required.", {
          selector: `[name="firstName"] + div p`,
        }),
      ).toBeNull();
      expect(screen.getAllByText("This field is required.")).toHaveLength(4);
    });
  });

  test("clears form after successful submission", async () => {
    renderComponent();

    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText("First name"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText("Last name"), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "johndoe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Create Account/i }));

    await waitFor(() => {
      expect(screen.getByPlaceholderText("First name")).toHaveValue("");
      expect(screen.getByPlaceholderText("Last name")).toHaveValue("");
      expect(screen.getByPlaceholderText("Username")).toHaveValue("");
      expect(screen.getByPlaceholderText("Email")).toHaveValue("");
      expect(screen.getByPlaceholderText("Password")).toHaveValue("");
    });
  });
});
