import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import CalendarComponent from './components/CalendarComponent';
import TodoList from './components/todoList';

function App() {
    return (
        <Router>
            <div style={{ height: "95vh", width: "100%", padding: "20px" }}>
                <nav style={{ marginBottom: '20px' }}>
                    <Link to="/">Calendar</Link> | <Link to="/tasks">To-Do List</Link>
                </nav>

                <Routes>
                    <Route path="/" element={<CalendarComponent />} />
                    <Route path="/tasks" element={<TodoList />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
