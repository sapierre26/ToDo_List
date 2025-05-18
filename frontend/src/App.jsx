import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import "./App.css";

import CalendarComponent from "./components/Calendar/page";
import MyApp from "./components/todolist/page";
import Login from "./components/Login/page";
import CreateAccount from "./components/CreateAccount/page";
import SplitScreen from "./components/SplitScreen/page";
import UserProfile from "./components/UserProfile/page";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Callback to update login status
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <div style={{ height: "95vh", width: "100%", padding: "20px" }}>
        <nav style={{ marginBottom: "20px" }}>
          {!isAuthenticated && (
            <>
              <Link to="/Login" className="button-link">Login</Link>
              <Link to="/createAccount" className="button-link">Create Account</Link>
            </>
          )}
          {isAuthenticated && (
            <>
              <Link to="/Calendar" className="button-link">Calendar</Link>
              <Link to="/Todolist" className="button-link">Todo List</Link>
              <Link to="/UserProfile" className="button-link">User Profile</Link>
            </>
          )}
        </nav>

        <Routes>
          <Route path="/" element={<Navigate to="/Login" />} />
          <Route path="/Login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/createAccount" element={<CreateAccount />} />
          <Route
            path="/Calendar"
            element={isAuthenticated ? <CalendarComponent /> : <Navigate to="/Login" />}
          />
          <Route
            path="/Todolist"
            element={isAuthenticated ? <MyApp /> : <Navigate to="/Login" />}
          />
          <Route
            path="/UserProfile"
            element={isAuthenticated ? <UserProfile /> : <Navigate to="/Login" />}
          />
          <Route path="/SplitScreen" element={<SplitScreen />} />
          <Route path="*" element={<div>Page not found.</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
