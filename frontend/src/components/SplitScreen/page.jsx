import ToDoList from "./LeftToDo";
import RightCalendar from "./RightCalendar";

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
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          backgroundColor: "#f0f0f0",
          padding: "20px",
          boxSizing: "border-box",
        }}
      >
        <ToDoList />
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          backgroundColor: "#ffffff",
          padding: "15px",
          boxSizing: "border-box",
        }}
      >
        <RightCalendar />
      </div>
    </div>
  );
};

export default SplitScreen;
