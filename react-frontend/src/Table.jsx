// src/Table.jsx for ToDolist App
import React from "react";
function TableHeader() {
	return (
		<thead>
			<tr>
				<th>Sun</th>
				<th>Mon</th>
				<th>Tue</th>
				<th>Wed</th>
				<th>Thu</th>
				<th>Fri</th>
				<th>Sat</th>
			</tr>
		</thead>
	);
}

function TableBody({month, year}) {
	console.log("In tableBody");
	//get the days present in that month and the first days of the month
	const getDaysInMonth = (year, month) => (new Date(year, month + 1, 0)).getDate();
	
	const getFirstDayOfMonth = (year, month) => (new Date(year, month, 1)).getDay();
	
	const daysInMonth = getDaysInMonth(year, month);
	const firstDay = getFirstDayOfMonth(year, month);
	console.log(firstDay);
	//an array for the calendar
	const calendarArray = Array(firstDay).fill(null);
	
	//filling the days of the monthh
	for (let i = 1; i <= daysInMonth; i++) {
		calendarArray.push(i);
	}
	//filling the empty slots at the end of the month
	while (calendarArray.length % 7 !== 0) {
		calendarArray.push(null);
	}
	//weeks
	const weeks = [];
	for (let i = 0; i < calendarArray.length; i += 7) {
		weeks.push((calendarArray.slice(i, i+7)));
	}
	
	return (
		<tbody>
			{weeks.map((week, row) => (
				<tr key={row}>
					{week.map((day, col) => (
						<td key={col}>{day || ""}</td>
					))}
				</tr>
			))}
		</tbody>
	);
}

function Table({month,year}) {
	return (
		<table>
			<TableHeader />
			<TableBody 
			month={month} 
			year={year} />
		</table>
	);
}

export default Table;