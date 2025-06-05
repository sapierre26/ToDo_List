import { useState, useEffect } from "react";
import { applyTheme } from "./utils/theme";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
} from "react-router-dom";
import "./App.css";

/* component imports */
import CalendarComponent from "./components/Calendar/page";
import MyApp from "./components/todolist/page";
import Login from "./components/Login/page";
import CreateAccount from "./components/CreateAccount/page";
import SplitScreen from "./components/SplitScreen/page";
import UserProfile from "./components/UserProfile/page";
import Settings from "./components/Settings/page";
import Navbar from "./navbar/Navbar";

/* image imports */
import calendarImage from "../Images/calendar.png";
import todolistImage from "../Images/to-do-list.png";
import settingImage from "../Images/settings.png";

// Manual JWT decode helper
function decodeJWT(token) {
  try {
    const payload = token.split(".")[1];
    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload);
  } catch {
    return null;
  }
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [profilePic, setProfilePic] = useState(null);

  const initializeUserPreferences = () => {
    const savedTheme = localStorage.getItem("theme") || "light";
    const savedFont = localStorage.getItem("font") || "Arial";
    applyTheme(savedTheme);
    document.body.style.fontFamily = savedFont;
  };

  useEffect(() => {
    initializeUserPreferences();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    if (token) {
      const decoded = decodeJWT(token);
      if (decoded && Date.now() < decoded.exp * 1000) {
        setIsAuthenticated(true);

        fetch("http://localhost:8000/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data?.profilePic) {
              setProfilePic(data.profilePic);
            }
          })
          .catch((err) => console.error("Failed to fetch profile:", err));
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

  if (isCheckingAuth) return <div>Loading...</div>;

  const handleLoginSuccess = async () => {
    setIsAuthenticated(true);

    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:8000/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();

      if (data?.profilePic) setProfilePic(data.profilePic);
    } catch (err) {
      console.error("Error fetching profile on login:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setIsAuthenticated(false);
    window.location.href = "/login";
  };

  return (
    <Router>
      {isAuthenticated && <Navbar />}

      {/* Profile Picture in top-right */}
      {isAuthenticated && profilePic && (
        <Link to="/UserProfile">
          <img src={profilePic} alt="Profile" className="profilePic" />
        </Link>
      )}

      <div style={{ height: "94vh", width: "100%", padding: "20px" }}>
        {/* Custom Navigation Bar */}
        {isAuthenticated && (
          <div
            style={{
              position: "fixed",
              top: "25px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "750px",
              height: "65px",
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              padding: "0 30px",
              borderRadius: "40px",
              boxShadow: "0 3px 10px rgba(0, 0, 0, 0.3)",
              backgroundColor: "var(--navbar-background-color)",
              zIndex: 1000,
            }}
          >
            <div style={{ display: "flex", gap: "110px" }}>
              <Link to="/Calendar" className="button-link">
                <img src={calendarImage} alt="Calendar" style={{ width: "20px", height: "20px" }} />
                <span>Calendar</span>
              </Link>
              <Link to="/Todolist" className="button-link">
                <img src={todolistImage} alt="Todo List" style={{ width: "20px", height: "20px" }} />
                <span>Todo List</span>
              </Link>
              <Link to="/Settings" className="button-link">
                <img src={settingImage} alt="Settings" style={{ width: "20px", height: "20px" }} />
                <span>Settings</span>
              </Link>
            </div>
          </div>
        )}

        {/* Main Routes */}
        <div className="page-content">
        <Routes>
          <Route
            path="/"
            element={<Navigate to={isAuthenticated ? "/Calendar" : "/Login"} replace />}
          />
          <Route
            path="/Login"
            element={
              isAuthenticated ? (
                <Navigate to="/Calendar" replace />
              ) : (
                <Login onLoginSuccess={handleLoginSuccess} />
              )
            }
          />
          <Route path="/createAccount" element={<CreateAccount />} />
          <Route
            path="/Calendar"
            element={
              isAuthenticated ? (
                <div
                  style={{
                    maxWidth: "2000px",
                    margin: "0 auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <CalendarComponent />
                </div>
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
            element={isAuthenticated ? <Settings /> : <Navigate to="/Login" />}
          />
          <Route path="/SplitScreen" element={<SplitScreen />} />
          <Route path="*" element={<div>Page not found.</div>} />
        </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
