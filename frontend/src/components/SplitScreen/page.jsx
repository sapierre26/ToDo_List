// import LeftSide from "./LeftToDo";

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
        {/* <LeftSide /> */}
      </div>

      <div
<<<<<<< HEAD
        style={{ flex: 1, overflowY: "auto", backgroundColor: "#ffffff", padding: "15px", boxSizing: "border-box" }}>
        <CalendarComponent />
      </div>
=======
        style={{
          flex: 1,
          overflowY: "auto",
          backgroundColor: "#ffffff",
          padding: "15px",
          boxSizing: "border-box",
        }}
      ></div>
>>>>>>> 6354e0ec6dd0f2e0c5c7bab00b6d0b58a1c9285e
    </div>
  );
};

export default SplitScreen;
