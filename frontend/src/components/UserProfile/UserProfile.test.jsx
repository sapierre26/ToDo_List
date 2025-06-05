import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UserProfile from "./page";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";

beforeEach(() => {
  jest.spyOn(window, "fetch");
  jest.spyOn(window, "alert").mockImplementation(() => {});
  jest.spyOn(window, "confirm").mockImplementation(() => true);
});

afterEach(() => {
  jest.restoreAllMocks();
});

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("UserProfile Component", () => {
  const fakeProfile = {
    username: "testuser",
    name: "Test Name",
    email: "test@example.com",
    image: "http://image.url/pic.jpg",
  };

  const onLogoutMock = jest.fn();

  test("renders without crashing", () => {
    renderWithRouter(<UserProfile onLogout={onLogoutMock} />);
    expect(screen.getByText("Save Settings")).toBeInTheDocument();
  });

  test("fetches and displays profile data", async () => {
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => fakeProfile,
    });
    renderWithRouter(<UserProfile onLogout={onLogoutMock} />);
    await waitFor(() =>
      expect(screen.getByDisplayValue(fakeProfile.name)).toBeInTheDocument(),
    );
    expect(screen.getByDisplayValue(fakeProfile.username)).toBeInTheDocument();
    expect(screen.getByDisplayValue(fakeProfile.email)).toBeInTheDocument();
    expect(screen.getByAltText("Profile")).toBeInTheDocument();
  });

  test("handles image upload", async () => {
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => fakeProfile,
    });
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ image: "http://image.url/new-pic.jpg" }),
    });
    renderWithRouter(<UserProfile onLogout={onLogoutMock} />);
    await waitFor(() => screen.getByDisplayValue(fakeProfile.name));
    const fileInput = screen.getByLabelText("Edit Picture");
    const file = new File(["dummy content"], "example.png", {
      type: "image/png",
    });
    fireEvent.change(fileInput, { target: { files: [file] } });
    await waitFor(() => screen.getByText("Profile picture updated!"));
  });

  test("deletes account when confirmed", async () => {
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => fakeProfile,
    });
    window.fetch.mockResolvedValueOnce({
      ok: true,
    });
    renderWithRouter(<UserProfile onLogout={onLogoutMock} />);
    await waitFor(() => screen.getByDisplayValue(fakeProfile.name));
    fireEvent.click(screen.getByText("Delete My Account"));
    await waitFor(() => expect(onLogoutMock).toHaveBeenCalled());
  });

  test("logs out properly", () => {
    renderWithRouter(<UserProfile onLogout={onLogoutMock} />);
    fireEvent.click(screen.getByText("Log Out"));
    expect(onLogoutMock).toHaveBeenCalled();
  });

  test("handles failed fetch gracefully", async () => {
    window.fetch.mockRejectedValueOnce(new Error("API down"));
    renderWithRouter(<UserProfile onLogout={onLogoutMock} />);
    await waitFor(() => screen.getByText("Failed to load profile."));
  });
});
