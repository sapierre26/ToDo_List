import React, { useEffect, useState } from "react";
import { Task, getTasks, deleteTask } from "../../api/tasks"; // Assuming the getTasks function is in api.js
import AddTask from "./addTask";
import './page.module.css';  // Assuming you have a separate CSS file for styling

function TodoList() {
  const [tasks, setTasks] = useState<Task[]>([]); // State to hold fetched tasks
  const [taskInput, setTaskInput] = useState('');
  const [priorityInput, setPriorityInput] = useState('low');
  const [dueDateInput, setDueDateInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch tasks and update state
    getTasks()
      .then((tasks) => {
        if (tasks) {
          setTasks(tasks); // Update the state with the fetched tasks
        }
      })
      .catch((error) => {
        console.log("Error fetching tasks:", error);
      });
  }, []); // Empty dependency array ensures this runs once on component mount

  const handleDelete = (taskId: string) => {
    console.log("Deleting task with ID:", taskId);  // Log to check if the correct taskId is passed
    deleteTask(taskId)
      .then(() => {
        setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
      })
      .catch((error) => {
        console.error("Error deleting task:", error);
      });
  };

  return (
    <div className="app-container">
      <h2>Tasks</h2>
      <div className="tasks-container">
        {tasks.length > 0 ? (
          <table className="tasks-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Priority</th>
              <th>Label</th>
              <th>Date</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id}>
                <td>{task.title}</td>
                <td>{task.priority}</td>
                <td>{task.label}</td>
                <td>{task.date}</td>
                <td>{task.description}</td>
                <td>
                  <button 
                    onClick={() => handleDelete(task._id)} 
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        ) : (
          <p>No tasks available</p> // Display this if no tasks are found
        )}
      </div>
      <div className="addTaskContainer">
        <AddTask />
      </div>
    </div>
  );
}

export default TodoList;