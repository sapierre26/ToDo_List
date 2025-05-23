import { getUsers } from "./users"; // Adjust import path accordingly

// Mocking fetch to simulate API calls
global.fetch = jest.fn();

describe("getUsers API", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  // Test for successful API call (status code 200)
  it("should fetch users successfully", async () => {
    const mockUsers = [
      { id: 1, name: "John Doe", email: "john@example.com" },
      { id: 2, name: "Jane Doe", email: "jane@example.com" },
    ];

    // Mock the fetch function to resolve with a successful response
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers,
    });

    const result = await getUsers();
    expect(result).toEqual(mockUsers);
    expect(fetch).toHaveBeenCalledWith("http://localhost:8000/api/Users", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
  });

  // Test for API failure (e.g., status code 400)
  it("should handle API failure", async () => {
    // Mock the fetch function to resolve with a failed response
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      statusText: "Bad Request",
      json: async () => ({ message: "Bad request" }),
    });

    const result = await getUsers();
    expect(result).toBeUndefined(); // Since the catch block doesn't return anything
    expect(fetch).toHaveBeenCalledWith("http://localhost:8000/api/Users", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
  });

  // Test for unexpected API error (e.g., network error)
  it("should handle unexpected errors", async () => {
    // Mock the fetch function to throw an error (simulating a network error)
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    const result = await getUsers();
    expect(result).toBeUndefined(); // Since the catch block doesn't return anything
    expect(fetch).toHaveBeenCalledWith("http://localhost:8000/api/Users", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
  });
});
