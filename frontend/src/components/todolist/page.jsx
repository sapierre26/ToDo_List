import React, { useEffect, useState } from "react";
import { getTasks, deleteTask } from "../../api/tasks";
import AddTask from "./addTask";
import styles from "./page.module.css";

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const fetchedTasks = await getTasks();
      if (fetchedTasks) setTasks(fetchedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleTaskAdded = (newTask) => {
    setTasks((prev) => [...prev, newTask]);
    setShowAddTask(false);
  };

  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "Invalid Date"
      : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "Invalid Date"
      : date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>To-Do List</h2>
      </div>
      <div className={styles.taskList}>
        {tasks.length === 0 ? (
          <p className={styles.emptyState}>No tasks!</p>
        ) : (
          <table className={styles.taskTable}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Priority</th>
                <th>Date/Time</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id}>
                  <td>{task.title}</td>
                  <td className={styles[task.label.toLowerCase()]}>
                    {task.label}
                  </td>
                  <td className={styles[task.priority.toLowerCase()]}>
                    {task.priority}
                  </td>
                  <td>
                    {formatDate(task.startDate)}
                    <br />
                    {task.label === "Event"
                      ? `${formatTime(task.startDate)} - ${formatTime(task.endDate)}`
                      : formatTime(task.endDate)}
                  </td>
                  <td>{task.description}</td>
                  <td>
                    <button
                      className={styles.deleteButton}
                      onClick={() => task._id && handleDelete(task._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {showAddTask && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <AddTask
              taskDate={selectedDate || undefined}
              onTaskAdded={handleTaskAdded}
              onClose={() => setShowAddTask(false)}
            />
          </div>
        </div>
      )}
      {!showAddTask && (
        <button
          className={styles.addButton}
          onClick={() => {
            setSelectedDate(new Date());
            setShowAddTask(true);
          }}
        >
          + Add Task
        </button>
      )}
    </div>
  );
};

export default TodoList;
