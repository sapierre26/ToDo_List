import React, { useState } from "react";
import { act } from "@testing-library/react";
import style from "./login.module.css";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
    setErrorMessage("");

    let hasError = false;

    if (!username) {
      setEmailError("Please enter your username");
      hasError = true;
    }

    if (!password) {
      setPasswordError("Please enter a password");
      hasError = true;
    }

    if (hasError) return;

    try {
      const response = await fetch("http://localhost:8000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, pwd: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      console.log("Login successful, token received:", data.token);

      if (rememberMe) {
        localStorage.setItem("token", data.token);
      } else {
        sessionStorage.setItem("token", data.token);
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
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {emailError && <p className={style.error}>{emailError}</p>}

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {passwordError && <p className={style.error}>{passwordError}</p>}

        <div className={style.checkboxContainer}>
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <label>Remember Me</label>
        </div>

        {errorMessage && <p className={style.error}>{errorMessage}</p>}

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

Login.propTypes = {
  onLoginSuccess: PropTypes.func,
};

export default Login;
