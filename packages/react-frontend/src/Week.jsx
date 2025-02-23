/* src/Week.jsx */
import React from "react";

function TableHeader({day, month, year}) {
	const currDateIndex = new Date(year, month, day).getDay();
	const firstDayOfWeek = new Date(year, month, day);
	const week = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
	let index = day - currDateIndex;
	for (let i = 0; i < 7; i++) {
		week[i] = week[i].concat(" ", index);
		index++;
	}
	
	const emptyColumns = [];
	for (let i = 0; i < 7; i++) {
		emptyColumns.push(null);
	}

	return (
		<thead>
			<tr>
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