import React, { useEffect, useState } from "react";
import { Task, getTasks } from "../../api/tasks"; // Assuming the getTasks function is in api.js
import AddTask from "./addTask";
import './page.module.css';  // Assuming you have a separate CSS file for styling

function MyApp() {
  const [tasks, setTasks] = useState<Task[]>([]); // State to hold fetched tasks

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
    
    const handleTaskAdded = (newTask) => {
      setTasks((prevTasks) => [...prevTasks, newTask]); // Add the new task to the task list
    };
  return (
    <div className="app-container">
      <div className="tasks-container">
        <h1>Tasks</h1>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task._id} className="task-card">
              <h2>{task.title}</h2>
              <p>Priority: {task.priority}</p>
              <p>Label: {task.label}</p>
              <p>Date: {task.date}</p>
              <p>{task.description}</p>
            </div>
          ))
        ) : (
          <p>No tasks available</p> // Display this if no tasks are found
        )}
      </div>
      <div className="add-task-container">
        <AddTask />
      </div>
    </div>
  );
}

export default MyApp;
