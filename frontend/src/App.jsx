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

        // Fetch profilePic after auth check
        fetch("http://localhost:8000/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
          if (data?.profilePic) {
            setProfilePic(data.profilePic); // it’s already a base64 data URL
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
    <div style={{ height: "94vh", width: "100%", padding: "20px", border: "solid" }}>
      {/* Top bar with nav links and profile pic */}
      {isAuthenticated ? (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          {/* Left: navigation links */}
        <Link to="/Calendar" className="button-link">
          <img src={calendarImage} alt="Calendar" style={{ width: "25px", marginRight: "6px" }} />
          Calendar
        </Link>
        <Link to="/Todolist" className="button-link">
          <img src={todolistImage} alt="Todo List" style={{ width: "25px", marginRight: "6px" }} />
          Todo List
        </Link>
        <Link to="/Settings" className="button-link">
          <img src={settingImage} alt="Settings" style={{ width: "25px", margin: "5px" }} />
        </Link>
          {/* Right: profile picture */}
          <Navbar profilePic={profilePic} />
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

      {/* App routes */}
      <Routes>
        <Route
          path="/"
          element={
            <Navigate to={isAuthenticated ? "/Calendar" : "/Login"} replace />
          }
        />
        <Route
          path="/Login"
          element={<Login onLoginSuccess={handleLoginSuccess} />}
        />
        <Route path="/createAccount" element={<CreateAccount />} />
        <Route
          path="/Calendar"
          element={
            isAuthenticated ? <CalendarComponent /> : <Navigate to="/Login" />
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
  </Router>
)};

export default App;
