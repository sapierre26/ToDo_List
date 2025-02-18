// src/Table.jsx

import React from "react";

function TableHeader() {
    return (
        <theaed>
            <tr> 
                <th>Task</th>
                <th>Status</th>
            </tr>
        </theaed>
    );
}

function TableBody(props) {
    const rows = props.characterData.map((row, index) => {
        return (
            <tr key={index}>
                <td>{row.task}</td>
                <td>{row.status}</td>
                <td>
                    <button onClick={() => props.removeCharacter(index)}>
                        Delete
                    </button>
                </td>
            </tr>
        );
    }
);
return (
    <tbody>
        {rows}
    </tbody>
);
}

function Table(props) {
    return (
        <table>
            <TableHeader />
            <TableBody 
                characterData={props.characterData} 
                removeCharacter={props.removeCharacter}
                />
        </table>
    )
}

export default Table;