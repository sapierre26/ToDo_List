import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import CalendarComponent from './components/Calendar/page';
import TodoList from './components/todolist/page';
import Login from './components/Login/page';
import CreateAccount from './components/CreateAccount/page';

function App() {
    return (
        <Router>
            <div style={{ height: "95vh", width: "100%", padding: "20px" }}>
                <nav style={{ marginBottom: '20px' }}>
                    <Link to="/Calendar" className="button-link">Calendar</Link>
                    <Link to="/Todolist" className="button-link">Todo List</Link>
                    <Link to="/Login" className="button-link">Login</Link>
                    <Link to="/createAccount" className="button-link">Create Account</Link>
                </nav>

                <Routes>
                    <Route path="/Calendar" element={<CalendarComponent />} />
                    <Route path="/Todolist" element={<TodoList />} />
                    <Route path="/Login" element={<Login />} />
                    <Route path="/createAccount" element={<CreateAccount/>} />
                </Routes>
            </div>
        </Router>
    );
}
export default App;
