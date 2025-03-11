import React, { useState } from 'react';

const TodoList = () => {
    const [tasks, setTasks] = useState([]);
    const [taskInput, setTaskInput] = useState('');
    const [priorityInput, setPriorityInput] = useState('low');
    const [dueDateInput, setDueDateInput] = useState('');
    const [error, setError] = useState('');

    // Add a new task
    const addTask = () => {
        if (!taskInput) {
            setError("cannot add empty task");
            setTimeout(() => setError(''), 3000);
            return; // prevents adding empty tasks 
        } else if (!dueDateInput) {
            setError("please add due date");
            setTimeout(() => setError(''), 3000);
            return;
        }
        const newTask = {
            id: Date.now(),
            description: taskInput,
            priority: priorityInput, 
            dueDate: dueDateInput,
            status: 'Pending',
        };
        setTasks([...tasks, newTask]);
        setTaskInput('');
        setDueDateInput('');
    };

    // Task completion (toggle status)
    const toggleStatus = (id) => {
        setTasks(
            tasks.map((task) => 
                task.id === id 
                ? { ...task, status: task.status === 'Pending' ? 'Completed' : 'Pending' }
                : task
            )
        );
    };

    // Delete task
    const deleteTask = (id) => {
        setTasks(tasks.filter((task) => task.id !== id));
    };

    return (
        <div> 
            <h1>To Do List</h1>
        
            <div>
                <input 
                    type="text" // Change type="type" to type="text"
                    placeholder="New Task"
                    value={taskInput}
                    onChange={(e) => setTaskInput(e.target.value)}
                />
                <select value={priorityInput} onChange={(e) => setPriorityInput(e.target.value)}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
                <input
                    type="date"
                    value={dueDateInput}
                    onChange={(e) => setDueDateInput(e.target.value)}
                />
                <button onClick={addTask}>Add Task</button>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
            <table>
                <thead>
                    <tr>
                        <th>Task</th>
                        <th>Priority</th>
                        <th>Due Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task) => (
                        <tr key={task.id}>
                            <td>{task.description}</td>
                            <td>{task.priority}</td>
                            <td>{task.dueDate}</td>
                            <td>{task.status}</td>
                            <td>
                                <button onClick={() => toggleStatus(task.id)}>
                                    {task.status === 'Pending' ? 'Complete' : 'Undo'}
                                </button>
                                <button onClick={() => deleteTask(task.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TodoList;
