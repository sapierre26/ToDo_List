import React, { useState } from 'react';
import style from './todolist.module.css';
import Table from '../Table/page'; 
// import AddTask from './addTask';

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

    // Task deletion
    const deleteTask = (id) => {
        setTasks(tasks.filter((task) => task.id !== id));
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

    return (
        <div>
            <h3>To Do List</h3>
            {/* Task input form */}
            <div className={style.addTaskContainer}>
                <input
                    className={style.field}
                    type="text"
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
                    className={style.field}
                    type="date"
                    value={dueDateInput}
                    onChange={(e) => setDueDateInput(e.target.value)}
                />
                <button onClick={addTask}>Add Task</button>
            </div>
            {error && <p>{error}</p>} {/* Display error message */}

            {/* Use Table Component */}
            <Table tasks={tasks} toggleStatus={toggleStatus} deleteTask={deleteTask} />
            {/* <AddTask /> */}
        </div>
    );
};

export default TodoList;
