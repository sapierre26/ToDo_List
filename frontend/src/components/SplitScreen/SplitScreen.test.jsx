//Mock testing for Split Screen
import { render, screen } from "@testing-library/react";
import SplitScreen from "./page.jsx";

jest.mock("../todolist/page.jsx", () => () => (
  <div data-testid="todolist">TodoList Mock Rendered</div>
));

jest.mock("./RightSide", () => () => (
  <div data-testid="rightside">RightSide Mock Rendered</div>
));

describe("SplitScreen Component", () => {
  it("should render TodoList and RightSide properly", () => {
    render(<SplitScreen />);
    expect(screen.getByTestId("todolist")).toBeInTheDocument();
    expect(screen.getByTestId("rightside")).toBeInTheDocument();
  });
});

