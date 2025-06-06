import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserProfile from "./page"; // adjust if your import path is different
import { BrowserRouter } from "react-router-dom";
const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

beforeAll(() => {
  jest.spyOn(window, "confirm").mockImplementation(() => true);
});
afterAll(() => {
  window.confirm.mockRestore();
});
const onLogoutMock = jest.fn();

const fakeProfile = {
  name: "Test Name",
  username: "testuser",
  email: "test@example.com",
  image: "http://image.url/pic.jpg",
};

beforeEach(() => {
  jest.clearAllMocks();
  window.fetch = jest.fn();
});

describe("UserProfile Component", () => {
  test("renders without crashing", async () => {
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => fakeProfile,
    });

    renderWithRouter(<UserProfile onLogout={onLogoutMock} />);
    await waitFor(() => screen.getByDisplayValue(fakeProfile.name));
  });

  test("fetches and displays profile data", async () => {
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => fakeProfile,
    });

    renderWithRouter(<UserProfile onLogout={onLogoutMock} />);
    await waitFor(() => screen.getByDisplayValue(fakeProfile.name));

    expect(screen.getByDisplayValue(fakeProfile.username)).toBeInTheDocument();
    expect(screen.getByDisplayValue(fakeProfile.email)).toBeInTheDocument();
  });

  test("handles failed fetch gracefully", async () => {
    window.fetch.mockRejectedValueOnce(new Error("API down"));

    renderWithRouter(<UserProfile onLogout={onLogoutMock} />);
    await waitFor(() => screen.getByText("Failed to load profile."));
  });

  test("saves profile successfully", async () => {
    window.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => fakeProfile,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: "Profile updated successfully!" }),
      });

    renderWithRouter(<UserProfile onLogout={onLogoutMock} />);
    await waitFor(() => screen.getByDisplayValue(fakeProfile.name));

    const nameInput = screen.getByDisplayValue(fakeProfile.name);
    fireEvent.change(nameInput, { target: { value: "New Name" } });
    fireEvent.click(screen.getByText("Save Settings"));

    await waitFor(() =>
      expect(
        screen.getByText("Profile updated successfully!"),
      ).toBeInTheDocument(),
    );
  });

  test("handles failed save gracefully", async () => {
    window.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => fakeProfile,
      })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: "Save failed" }),
      });

    renderWithRouter(<UserProfile onLogout={onLogoutMock} />);
    await waitFor(() => screen.getByDisplayValue(fakeProfile.name));

    fireEvent.click(screen.getByText("Save Settings"));

    await waitFor(() =>
      expect(screen.getByText("Save failed")).toBeInTheDocument(),
    );
  });

  test("handles image upload failure", async () => {
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => fakeProfile,
    });

    renderWithRouter(<UserProfile onLogout={onLogoutMock} />);
    await waitFor(() => screen.getByDisplayValue(fakeProfile.name));

    const fileInput = screen.getByLabelText("Edit Picture");
    const file = new File(["dummy content"], "example.png", {
      type: "image/png",
    });
    fireEvent.change(fileInput, { target: { files: [file] } });

    // simulate upload failure
    await waitFor(() =>
      expect(screen.getByText("Upload failed.")).toBeInTheDocument(),
    );
  });

  test("deletes account when confirmed", async () => {
    window.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => fakeProfile,
      })
      .mockResolvedValueOnce({
        ok: true,
      });

    renderWithRouter(<UserProfile onLogout={onLogoutMock} />);
    await waitFor(() => screen.getByDisplayValue(fakeProfile.name));

    fireEvent.click(screen.getByText("Delete My Account"));
    await waitFor(() => expect(onLogoutMock).toHaveBeenCalled());
  });

  test("handles failed delete account", async () => {
    window.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => fakeProfile,
      })
      .mockResolvedValueOnce({
        ok: false,
      });

    renderWithRouter(<UserProfile onLogout={onLogoutMock} />);
    await waitFor(() => screen.getByDisplayValue(fakeProfile.name));

    fireEvent.click(screen.getByText("Delete My Account"));

    await waitFor(() =>
      expect(screen.getByText("Error deleting account.")).toBeInTheDocument(),
    );
  });

  test("logs out properly", async () => {
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => fakeProfile,
    });

    renderWithRouter(<UserProfile onLogout={onLogoutMock} />);
    await waitFor(() => screen.getByDisplayValue(fakeProfile.name));

    fireEvent.click(screen.getByText("Log Out"));
    expect(onLogoutMock).toHaveBeenCalled();
  });

  test("handles contact support button", async () => {
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => fakeProfile,
    });

    renderWithRouter(<UserProfile onLogout={onLogoutMock} />);
    await waitFor(() => screen.getByDisplayValue(fakeProfile.name));

    const supportBtn = screen.getByText("Contact Support");
    expect(supportBtn).toBeInTheDocument();
  });
});
