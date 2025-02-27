//ToDoList
import React from 'react'
import './App.css'
<<<<<<< HEAD
import Month from "./Month"
import Week from "./Week"
import Day from "./Day"
import SplitScreen from "./SplitScreen.jsx"
=======
import CalendarComponent from './CalendarComponent';
>>>>>>> main

function App() {
	return (
<<<<<<< HEAD
		<div className="buttons">
			<button onClick={() => setView('month')}>Month</button> <button onClick={() => setView('week')}>Week</button>  <button onClick={() => setView('day')}>Day</button>
			<div className="container">
			{view == 'month' ? (
					<Month 
						month={month} 
						year={year}
					/> 
				) : view === 'week' ? (
					<Week 
						day={day}
						month={month}
						year={year} 
					/>
				) : (
					<Day
						day={day}
						month={month}
						year={year} 
					/>
				)
			}
			</div>
		</div>
	);

=======
        <div style={{ height: "95vh", width: "100%", padding: "20px", display: "block", justifyContent: "center", alignItems: "center" }}>
            <CalendarComponent />
        </div>
    );
>>>>>>> main
}

export default App;
