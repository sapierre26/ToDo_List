import { useEffect, useState } from "react";
import { getTasks, deleteTask } from "../../api/tasks.js";
import AddTask from "./addTask";
import EditTask from "./editTask";
import styles from "./page.module.css";

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [taskToEdit, setTaskToEdit] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const fetchedTasks = await getTasks(token);
      if (fetchedTasks) setTasks(fetchedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleTaskAdded = (task) => {
    setTasks((prev) => {
      const i = prev.findIndex((t) => t._id === task._id);
      if (i !== -1) {
        const updated = [...prev];
        updated[i] = task;
        return updated;
      }
      return [...prev, task];
    });
    setShowAddTask(false);
    setTaskToEdit(null);
  };

  const handleDelete = async (taskId) => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      await deleteTask(taskId, token);
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleEditTask = (taskId) => {
    const task = tasks.find((t) => t._id === taskId);
    if (task) {
      setTaskToEdit(task);
      setShowAddTask(true);
    }
  };

  const formatTime = (str) => {
    const date = new Date(str);
    return isNaN(date)
      ? "Invalid"
      : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (str) => {
    const date = new Date(str);
    return isNaN(date)
      ? "Invalid"
      : date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <div className={styles.container}>
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
                  <td
                    className={styles[task.label?.toLowerCase() || "default"]}
                  >
                    {task.label || "Unknown"}
                  </td>
                  <td
                    className={
                      styles[task.priority?.toLowerCase() || "default"]
                    }
                  >
                    {task.priority || "Unknown"}
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
                      onClick={() => handleDelete(task._id)}
                    >
                      Delete
                    </button>
                    <button
                      className={styles.modifyButton}
                      onClick={() => handleEditTask(task._id)}
                    >
                      Edit
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
            {taskToEdit ? (
              <EditTask
                taskToEdit={taskToEdit}
                onTaskUpdated={handleTaskAdded}
                onClose={() => {
                  setShowAddTask(false);
                  setTaskToEdit(null);
                }}
              />
            ) : (
              <AddTask
                taskDate={selectedDate}
                onTaskAdded={handleTaskAdded}
                onClose={() => setShowAddTask(false)}
              />
            )}
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
