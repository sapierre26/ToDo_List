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
	console.log(firstDayOfWeek);
	week.forEach(value => console.log(value));
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

function Week({day, month,year}) {
	return (
		<table>
			<TableHeader 
				day={day}
				month={month} 
				year={year}
			/>
		</table>
	);
}

export default Week;