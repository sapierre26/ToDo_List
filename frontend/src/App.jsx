import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";
import CalendarComponent from "./components/Calendar/page";
import TodoList from "./components/todolist/page";
import Login from "./components/Login/page";
import AddTask from "./components/todolist/addTask";

function App() {
  return (
    <Router>
      <div style={{ height: "95vh", width: "100%", padding: "20px" }}>
        <nav style={{ marginBottom: "20px" }}>
          <Link to="/calendar" className="button-link">
            Calendar
          </Link>
          <Link to="/todolist" className="button-link">
            Todo List
          </Link>
          <Link to="/login" className="button-link">
            Login
          </Link>
        </nav>

        <Routes>
          <Route path="/calendar" element={<CalendarComponent />} />
          <Route path="/todolist" element={<TodoList />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
