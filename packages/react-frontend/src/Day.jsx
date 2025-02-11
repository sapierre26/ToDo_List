/* src/Day.jsx */
/* src/Week.jsx */
import React from "react";

function TableHeader({day, month, year}) {
	const currDateIndex = new Date(year, month, day).getDay();
	const weeks = {"SUN " : 0, "MON " : 1, "Tue " : 2, "WED ":3, "THU ":4, "FRI ":5, "SAT ": 6};
	let dayOfWeek = Object.keys(weeks).find(key => weeks[key] === currDateIndex);
	return (
		<thead>
			<tr style={{background: "black", color: "white"}}>
				<th style={{textAlign: 'left'}}>
					{dayOfWeek}
					{day}
				</th>
			</tr>
		</thead>
	);
}
function TableBody() {
	return (
		<tbody> 
			<th style={{width: "80px", height: "600px"}}>
				{[]}
			</th>
		</tbody>
	);
}
function Day({day, month,year}) {
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

export default Day;