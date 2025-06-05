import { useState } from "react";
import style from "./login.module.css";
import styles from "../CreateAccount/createAccount.module.css";
import { useNavigate, Link } from "react-router-dom";
import PropTypes from "prop-types";
import API_BASE from "./config";

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setUsernameError("");
    setPasswordError("");
    setErrorMessage("");

    try {
      const response = await fetch(`${API_BASE}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, pwd: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.message === "Missing username.") {
          setUsernameError("Please enter username.");
        } else if (data.message === "Missing password.") {
          setPasswordError("Please enter password.");
        } else if (data.message === "All fields are required.") {
          setUsernameError("Please enter username.");
          setPasswordError("Please enter password.");
        } else {
          setErrorMessage(data.message || "Login failed.");
        }
        return;
      }

      console.log("Login successful, token received:", data.token);

      if (data.token) {
        localStorage.setItem("token", data.token);
      } else {
        console.error("No token received in login response");
      }

      if (onLoginSuccess) onLoginSuccess();

      navigate("/Calendar");
    } catch (err) {
      console.error("Error during login:", err.message);
      setErrorMessage(err.message || "An error occurred");
    }
  };

  return (
    <div className={style.loginContainer}>
      <h3>Login</h3>
      {errorMessage && <p className={style.error}>{errorMessage}</p>}
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <div className={styles.errorContainer}>
          {usernameError && <p className={style.error}>{usernameError}</p>}
        </div>

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className={styles.errorContainer}>
          {passwordError && <p className={style.error}>{passwordError}</p>}
        </div>

        <button type="submit">Login</button>
        <div className={styles.linkContainer}>
          <Link to="/createAccount" className={styles.link}>
            Create an account
          </Link>
        </div>
      </form>
    </div>
  );
};

Login.propTypes = {
  onLoginSuccess: PropTypes.func,
};

export default Login;
