import { useState } from "react";
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
        headers: { 
          "Content-Type": "application/json",
         },
        body: JSON.stringify({ username, pwd: password }),
      });

      const msg = await response.text();

      if (!response.ok) {
        console.error("backend response:", msg);
        throw new Error(msg);
      }
      const data = JSON.parse(msg);
      console.log("Login successful, token received:", data.token);

      if (rememberMe) {
        localStorage.setItem("token", data.token); // persists across browser restarts
      } else {
        sessionStorage.setItem("token", data.token); // cleared when browser closes
      }

      if (onLoginSuccess) onLoginSuccess();
      navigate("/SplitScreen");
    } catch (err) {
      setErrorMessage(err.message);
      console.error("Error during login:", err.message);
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
          <span>Remember Me</span>
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
