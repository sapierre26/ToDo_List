import TodoList from "../todolist/page";
import CalendarComponent from "../Calendar/page";
import RightSide from './RightSide';

const SplitScreen = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "100vw",
        display: "flex",
        margin: 0,
        padding: 0,
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <div style={{ flex: 1, overflowY: "auto", backgroundColor: "#f0f0f0" }}>
        <TodoList />
      </div>
      <div style={{ flex: 1, overflowY: "auto", backgroundColor: "#ffffff" }}>
        <RightSide />
      </div>
    </div>
  );
};

export default SplitScreen;
