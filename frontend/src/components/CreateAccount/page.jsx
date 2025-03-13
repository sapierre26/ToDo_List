import React, { useState } from 'react';
// import style from './createAccount.css'; 
// import AddTask from '../todolist/addTask';

const createAccount = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [emailError, setEmailError] = useState('');

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
        }
    };
    
    return (
        <div>
            {/* <AddTask /> */}
            <h2>Create an account</h2>
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
                <button onClick={onSubmit}>Create an account</button>
            </div>
        </div>
    );
};

export default createAccount;