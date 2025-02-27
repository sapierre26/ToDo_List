//ToDoList
import React from 'react'
import './App.css'

// import SplitScreen from "./SplitScreen.jsx"
import CalendarComponent from './components/CalendarComponent';


function App() {
	return (
        <div style={{ height: "95vh", width: "100%", padding: "20px", display: "block", justifyContent: "center", alignItems: "center" }}>
            <CalendarComponent />
        </div>
    );
}

export default App;
