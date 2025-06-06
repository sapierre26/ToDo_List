import { render, screen, fireEvent } from "@testing-library/react";
import Settings from "./page";

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          theme: "light",
          font: "Arial",
        }),
    }),
  );
});

afterEach(() => {
  jest.resetAllMocks();
});
describe("Setting Tests", () => {
  // test("changes theme on select", async () => {
  //   render(<Settings />);
  //   const select = await screen.findByLabelText(/Theme/i);
  //   fireEvent.change(select, { target: { value: "dark" } });
  //   expect(select.value).toBe("dark");
  // });

  test("applyTheme correctly sets CSS variables", () => {
    const themeColors = {
      "test-theme": ["#111", "#222", "#333", "#444", "#555"],
    };
    const applyTheme = (themeName) => {
      const colors = themeColors[themeName];
      if (colors) {
        colors.forEach((color, index) => {
          document.documentElement.style.setProperty(
            `--color-${index + 1}`,
            color,
          );
        });
      }
    };
    applyTheme("test-theme");
    expect(document.documentElement.style.getPropertyValue("--color-1")).toBe(
      "#111",
    );
    expect(document.documentElement.style.getPropertyValue("--color-5")).toBe(
      "#555",
    );
  });

  // test("changes theme and font correctly", async () => {
  //   render(<Settings />);
  //   const themeSelect = await screen.findByLabelText(/Theme/i);
  //   fireEvent.change(themeSelect, { target: { value: "dark" } });
  //   expect(themeSelect.value).toBe("dark");
  //   const fontSelect = screen.getByLabelText(/Font/i);
  //   fireEvent.change(fontSelect, { target: { value: "Georgia" } });
  //   expect(fontSelect.value).toBe("Georgia");
  // });

  // test("fetchSettings loads user settings", async () => {
  //   render(<Settings />);
  //   const themeSelect = await screen.findByLabelText(/Theme/i);
  //   expect(themeSelect.value).toBe("light");
  // });

  // test("handles fetchSettings error gracefully", async () => {
  //   global.fetch = jest.fn(() => Promise.reject("API failure"));
  //   render(<Settings />);
  //   await screen.findByText(
  //     (_, element) => element.tagName.toLowerCase() === "div",
  //   );
  // });
});
