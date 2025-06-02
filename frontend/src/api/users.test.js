import { getUsers } from "./users";
global.fetch = jest.fn();

describe("getUsers API", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("Status code 400: Should handle API failure", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      statusText: "Bad Request",
      json: async () => ({}),
    });
    const result = await getUsers();
    expect(result).toBeUndefined();
    expect(consoleSpy).toHaveBeenCalledWith("Error:", expect.any(Error));
    consoleSpy.mockRestore();
  });

  it("should fetch users successfully", async () => {
    const mockUsers = [
      { id: 1, name: "John Doe", email: "john@example.com" },
      { id: 2, name: "Jane Doe", email: "jane@example.com" },
    ];
    fetch.mockResolvedValueOnce({
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

  it("Network Error: should handle unexpected errors", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    fetch.mockRejectedValueOnce(new Error("Network error"));

    const result = await getUsers();
    expect(result).toBeUndefined();
    expect(consoleSpy).toHaveBeenCalledWith("Error:", expect.any(Error));
    consoleSpy.mockRestore();
  });
});
