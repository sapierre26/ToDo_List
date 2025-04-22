import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css"; // Make sure the CSS file is correctly linked
import CalendarComponent from "./components/Calendar/page";
import MyApp from "./components/todolist/page";
import Login from "./components/Login/page";
import CreateAccount from "./components/CreateAccount/page";
import Table from "./components/Table/page";
import SplitScreen from "./components/SplitScreen/page";
import UserProfile from "./components/UserProfile/page";

function App() {
  return (
    <Router>
      <div style={{ height: "95vh", width: "100%", padding: "20px" }}>
        <nav style={{ marginBottom: "20px" }}>
	  <Link to="/Calendar" className="button-link">
            Calendar
          </Link>
          <Link to="/Todolist" className="button-link">
            Todo List
          </Link>
          <Link to="/Login" className="button-link">
            Login
          </Link>
          <Link to="/createAccount" className="button-link">
            Create Account
          </Link>
          <Link to="/UserProfile" className="button-link">
            User Profile
          </Link>

        </nav>

        <Routes>
          <Route path="/Calendar" element={<CalendarComponent />} />
          <Route path="/Todolist" element={<MyApp />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/createAccount" element={<CreateAccount />} />
	  <Route path="/SplitScreen" element={<SplitScreen />} />
	  <Route path="*" element={<div>Page not found.</div>} />
          <Route path="/UserProfile" element={<UserProfile />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
