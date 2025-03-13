import React, { useState } from "react";
import style from "./addTask.module.css"; // Assuming the correct path for your CSS
import { addTask } from "../../api/tasks";

const AddTask = () => {
  const [title, setTitle] = useState(""); // Track task title
  const [date, setDate] = useState(""); // Track task date
  const [priority, setPriority] = useState(""); // Track task priority
  const [label, setLabel] = useState(""); // Track task label
  const [description, setDescription] = useState(""); // Track task description

  // Handle form submission for posting a task
  const postTask = async (event) => {
    event.preventDefault(); // Prevent default form submission

    // Validate inputs
    if (!title || !date || !priority || !label || !description) {
      console.error("Task information is required.");
      return;
    }

    const newTask = {
      title,
      date,
      priority,
      label,
      description,
    };

    try {
      // Call the addTask function and await its response
      const isTaskAdded = await addTask(newTask);

      if (isTaskAdded) {
        // Clear form fields after submitting
        setTitle("");
        setDate("");
        setPriority("");
        setLabel("");
        setDescription("");

        console.log("Task posted successfully!");

        // Notify the parent component to update the task list
        onTaskAdded(newTask);
      }
    } catch (err) {
      console.error("Error posting task:", err);
    }
  };

  return (
    <form className={style.form} onSubmit={postTask}>
      <h3>Add Task</h3>
      <input
        className={style.field}
        type="text"
        name="task-title"
        placeholder="Title"
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)} // Update task title
      />
      <input
        className={style.field}
        type="text"
        name="task-date"
        placeholder="Date"
        required
        value={date}
        onChange={(e) => setDate(e.target.value)} // Update task date
      />
      <input
        className={style.field}
        type="text"
        name="task-priority"
        placeholder="Priority"
        required
        value={priority}
        onChange={(e) => setPriority(e.target.value)} // Update task priority
      />
      <input
        className={style.field}
        type="text"
        name="task-label"
        placeholder="Label"
        required
        value={label}
        onChange={(e) => setLabel(e.target.value)} // Update task label
      />
      <textarea
        className={style.description}
        name="description"
        placeholder="Description"
        required
        value={description}
        onChange={(e) => setDescription(e.target.value)} // Update task description
      ></textarea>
      <button className={style.button} type="submit">
        Submit
      </button>
    </form>
  );
};

export default AddTask;
