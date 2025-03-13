// Table.js
import React from 'react';

// Table Header Component
const TableHeader = () => (
    <thead>
        <tr>
            <th>Task</th>
            <th>Priority</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Actions</th>
        </tr>
    </thead>
);

// Table Body Component
function TableBody(props) {
    const rows = (props.tasks || []).map((task) => {  // Add fallback to empty array if tasks is undefined
        return (
            <tr key={task.id}>
                <td>{task.description}</td>
                <td>{task.priority}</td>
                <td>{task.dueDate}</td>
                <td>{task.status}</td>
                <td>
                    <button onClick={() => props.toggleStatus(task.id)}>
                        {task.status === 'Pending' ? 'Complete' : 'Undo'}
                    </button>
                    <button onClick={() => props.deleteTask(task.id)}>Delete</button>
                </td>
            </tr>
        );
    });

    return <tbody>{rows}</tbody>;
}

// Table Component
const Table = ({ tasks, toggleStatus, deleteTask }) => {
    return (
        <table>
            <TableHeader />
            <TableBody tasks={tasks} toggleStatus={toggleStatus} deleteTask={deleteTask} />
        </table>
    );
};

export default Table;
