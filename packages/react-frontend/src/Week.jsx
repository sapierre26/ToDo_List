/* src/Week.jsx */
import React from "react";

function TableHeader({day, month, year}) {
	const currDateIndex = new Date(year, month, day).getDay();
	const firstDayOfWeek = new Date(year, month, day);
	const week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	let index = day - currDateIndex;
	for (let i = 0; i < 7; i++) {
		week[i] = week[i].concat(" ", index);
		index++;
	}
	
	week.forEach(value => console.log(value));
	return (
		<thead>
			<tr style={{background: "black", color: "white"}}>
				{week.map((dayName, col) => (
					<td key={col}>{dayName}</td>
				))}
			</tr>
		</thead>
	);
}
function TableBody() {
	const emptyColumns = [];
	for (let i = 0; i < 7; i++) {
		emptyColumns.push(null);
	}
	return (
		<tbody> 
			<tr>
				{emptyColumns.map((empty, col) => (
					<td key={col} style= {{width: "80px", height: "900px"}}>{empty}</td>
				))}
			</tr>
		</tbody>
	);
}
function Week({day, month,year}) {
	return (
		<table>
			<TableBody />
			<TableHeader 
				day={day}
				month={month} 
				year={year}
			/>
		</table>
	);
}

export default Week;