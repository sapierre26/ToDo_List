//ToDoList
import { useState } from 'react'
import './App.css'
import Month from "./Month"
import Week from "./Week"
import Day from "./Day"

function App() {
	const today = new Date();
	const [month, setmonth] = useState(today.getMonth());
	const [year, setYear] = useState(today.getFullYear());
	const [day, setDay] = useState(today.getDate());
	const [view, setView] = useState('month');
	return (
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
}

export default App
