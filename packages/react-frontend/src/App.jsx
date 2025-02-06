//ToDoList
import { useState } from 'react'
import './App.css'
import Table from "./Table"

function App() {
	const today = new Date();
	const [month, setmonth] = useState(today.getMonth());
	const [year, setYear] = useState(today.getFullYear());
	
	return (
		<div className="container">
			<Table 
				month={month} 
				year={year}
			/>
		</div>
	);
}

export default App
