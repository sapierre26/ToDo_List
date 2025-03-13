import React, { useState } from 'react';
import style from './login.module.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false); // State for Remember Me checkbox
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const onSubmit = () => {
        setEmailError('');
        setPasswordError('');
        
        if (!username) {
            setEmailError("Please enter your username");
        } else if (!password) {
            setPasswordError("Please enter a password");
        } else {
            // Handle successful login (e.g., submit the form)
            console.log("Form submitted with username:", username, "and password:", password);
            console.log("Remember Me:", rememberMe); // Log the rememberMe state
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
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <div className={style.checkboxContainer}>
                    <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)} // Toggle Remember Me state
                    />
                    <label>Remember Me</label>
                </div>
                <button onClick={onSubmit}>Login</button>
                
                {emailError && <p>{emailError}</p>}
                {passwordError && <p>{passwordError}</p>}
            </div>
        </div>
    );
}

export default Login;
