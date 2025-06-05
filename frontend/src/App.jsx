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

/* component page imports */
import CalendarComponent from "./components/Calendar/page";
import MyApp from "./components/todolist/page";
import Login from "./components/Login/page";
import CreateAccount from "./components/CreateAccount/page";
import SplitScreen from "./components/SplitScreen/page";
import UserProfile from "./components/UserProfile/page";
import Settings from "./components/Settings/page";
import Navbar from "./navbar/Navbar";

/* image imports */
import calendarImage from "/Images/calendar.png";
import todolistImage from "/Images/to-do-list.png";
import settingImage from "/Images/settings.png";

// Manual JWT decode helper
function decodeJWT(token) {
  try {
    const payload = token.split(".")[1];
    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload);
  } catch (e) {
    return null;
  }
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    const savedFont = localStorage.getItem("font") || "Arial";
    applyTheme(savedTheme);
    document.body.style.fontFamily = savedFont;
  }, []);

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

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

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setIsAuthenticated(false);
    window.location.href = "/login";
  };

  return (
    <Router>
      <div style={{ height: "94vh", width: "100%", padding: "20px" }}>
        {isAuthenticated ? (
          <div
            style={{
              position: "fixed",
              top: "25px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "750px", // Wider to contain buttons and avatar neatly
              height: "65px",
              backgroundColor: "var(--navbar-background-color)",
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              padding: "0 30px",
              borderRadius: "40px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
              zIndex: 1000,
            }}
          >
            {/* Navigation links */}
            <div style={{ display: "flex", gap: "14px", alignItems: "center", gap: "120px" }}>
              <Link to="/Calendar" className="button-link">
                <img src={calendarImage} alt="Calendar" style={{ width: "18px" }} />
                Calendar
              </Link>
              <Link to="/Todolist" className="button-link">
                <img src={todolistImage} alt="Todo List" style={{ width: "18px" }} />
                Todo List
              </Link>
              <Link to="/Settings" className="button-link">
                <img src={settingImage} alt="Settings" style={{ width: "18px" }} />
                Settings
              </Link>
            </div>

            {/* Profile picture */}
            <div 
              style={{ 
                height: "50px", 
                width: "50px", 
                borderRadius: "50%", 
                overflow: "hidden",
                alignSelf: "center",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "white",
                }}>
              <Navbar profilePic={profilePic} />
            </div>
          </div>
        ) : (
          <nav style={{ marginBottom: "20px" }}>
            <Link to="/Login" className="button-link">
              Login
            </Link>
            <Link to="/createAccount" className="button-link">
              Create Account
            </Link>
          </nav>
        )}

        <Routes>
          <Route
            path="/"
            element={<Navigate to={isAuthenticated ? "/Calendar" : "/Login"} replace />}
          />
          <Route path="/Login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/createAccount" element={<CreateAccount />} />
          <Route
            path="/Calendar"
            element={
              isAuthenticated ? (
                <div
                  style={{
                    maxWidth: "1100px", // Expandable width
                    margin: "0 auto", // Center it
                    paddingTop: "45px", // Push below navbar
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem"
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
            element={isAuthenticated ? <UserProfile onLogout={handleLogout} /> : <Navigate to="/Login" />}
          />
          <Route
            path="/Settings"
            element={isAuthenticated ? <Settings /> : <Navigate to="/Login" />}
          />
          <Route path="/SplitScreen" element={<SplitScreen />} />
          <Route path="*" element={<div>Page not found.</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;