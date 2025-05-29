import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
} from "react-router-dom";
import "./App.css";

import CalendarComponent from "./components/Calendar/page";
import MyApp from "./components/todolist/page";
import Login from "./components/Login/page";
import CreateAccount from "./components/CreateAccount/page";
import SplitScreen from "./components/SplitScreen/page";
import UserProfile from "./components/UserProfile/page";
import Settings from "./components/Settings/page";

// Manual JWT decode helper (no external lib)
function decodeJWT(token) {
  try {
    const payload = token.split(".")[1]; // get payload part
    const decodedPayload = atob(payload); // base64 decode
    return JSON.parse(decodedPayload); // parse JSON
  } catch (e) {
    return e;
  }
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (token) {
      const decoded = decodeJWT(token);
      if (decoded) {
        const isExpired = Date.now() > decoded.exp * 1000;
        if (!isExpired) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          setIsAuthenticated(false);
        }
      } else {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }

    setIsCheckingAuth(false);
  }, []);

  if (isCheckingAuth) {
    return <div>Loading...</div>;
  }

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <Router>
      <div style={{ height: "95vh", width: "100%", padding: "20px" }}>
        <nav style={{ marginBottom: "20px" }}>
          {!isAuthenticated && (
            <>
              <Link to="/Login" className="button-link">
                Login
              </Link>
              <Link to="/createAccount" className="button-link">
                Create Account
              </Link>
            </>
          )}
          {isAuthenticated && (
            <>
              <Link to="/Calendar" className="button-link">
                Calendar
              </Link>
              <Link to="/Todolist" className="button-link">
                Todo List
              </Link>
              <Link to="/UserProfile" className="button-link">
                User Profile
              </Link>
              <Link to="/Settings" className="button-link">
                Settings
              </Link>
            </>
          )}
        </nav>

        <Routes>
          <Route path="/" element={<Navigate to="/Login" />} />
          <Route
            path="/Login"
            element={<Login onLoginSuccess={handleLoginSuccess} />}
          />
          <Route path="/createAccount" element={<CreateAccount />} />
          <Route
            path="/Calendar"
            element={
              isAuthenticated ? (
                <CalendarComponent />
              ) : (
                <Navigate to="/Login" />
              )
            }
          />
          <Route
            path="/Todolist"
            element={isAuthenticated ? <MyApp /> : <Navigate to="/Login" />}
          />
          <Route
            path="/UserProfile"
            element={
              isAuthenticated ? (
                <UserProfile onLogout={handleLogout} />
              ) : (
                <Navigate to="/Login" />
              )
            }
          />
          <Route
            path="/Settings"
            element={
              isAuthenticated ? (
                <Settings />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/SplitScreen" element={<SplitScreen />} />
          <Route path="*" element={<div>Page not found.</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
