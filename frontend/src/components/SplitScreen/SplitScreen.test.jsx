//Mock testing for Split Screen
import { render, screen } from "@testing-library/react";
import SplitScreen from "./page.jsx";

jest.mock("../todolist/page.jsx", () => {
  const MockTodoList = () => (
    <div data-testid="todolist">TodoList Mock Rendered</div>
  );
  MockTodoList.displayName = "MockTodoList";
  return MockTodoList;
});

jest.mock("./RightSide", () => {
  const MockRightSide = () => (
    <div data-testid="rightside">RightSide Mock Rendered</div>
  );
  MockRightSide.displayName = "MockRightSide";
  return MockRightSide;
});

describe("SplitScreen Component", () => {
  it("should render TodoList and RightSide properly", () => {
    render(<SplitScreen />);
    expect(screen.getByTestId("todolist")).toBeInTheDocument();
    expect(screen.getByTestId("rightside")).toBeInTheDocument();
  });
});
