import React, { useState } from 'react';
import style from './login.module.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const onSubmit = async () => {
        setEmailError('');
        setPasswordError('');

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
            const response = await fetch("http://localhost:8000/api/Users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, pwd: password })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Login failed:", errorData);
            } else {
                const result = await response.json();
                console.log("Login successful:", result);
                console.log("Remember Me:", rememberMe);
                // Redirect or store token as needed
            }
        } catch (error) {
            console.error("Error during login:", error);
        }
    };

    return (
        <div className={style.loginContainer}>
            <h3>Login</h3>
            <div>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                {emailError && <p>{emailError}</p>}

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {passwordError && <p>{passwordError}</p>}

                <div className={style.checkboxContainer}>
                    <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label>Remember Me</label>
                </div>

                <button onClick={onSubmit}>Login</button>
            </div>
        </div>
    );
};

export default Login;
