import React, { useState } from 'react';
import style from './createAccount.module.css'; 

const CreateAccount = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [emailError, setEmailError] = useState('');

    const onSubmit = () => {
        // Reset error messages before validation
        setEmailError('');
        setPasswordError('');
        
        // Check if any input fields are empty
        if (!firstName || !lastName || !username || !password || !email) {
            setEmailError("All fields are required.");
        } else if (!lastName || !username || !password || !email) {
            setEmailError("Please enter your first name");
        } else if (!password) {
            setPasswordError("Please enter a password");
        } else {
            // Handle successful form submission
            const { password, ...safeData } = FormData;
            console.log("form submitted (safe): ", safeData);
            // Reset the form after successful submission
            setFirstName('');
            setLastName('');
            setUsername('');
            setEmail('');
            setPassword('');
        }
    };
    
    return (
        <div>
            <h3>Create an account</h3>
            <div> 
                <input 
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
                <input 
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />

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
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button onClick={onSubmit}>Create an account</button>

                {emailError && <p style={{ color: 'red' }}>{emailError}</p>}
                {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
            </div>
        </div>
    );
};

export default CreateAccount;
