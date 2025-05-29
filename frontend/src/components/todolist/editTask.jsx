import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import style from "./addTask.module.css";
import { updateTask } from "../../api/tasks";

const EditTask = ({ taskToEdit, onTaskUpdated, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    priority: "Low",
    label: "Task",
    description: "",
  });

    useEffect(() => {
    if (taskToEdit) {
        const start = new Date(taskToEdit.startDate);
        const end = new Date(taskToEdit.endDate);

        if (!isNaN(start) && !isNaN(end)) {
        setFormData({
            title: taskToEdit.title,
            date: start.toISOString().split("T")[0],
            startTime: start.toTimeString().split(":").slice(0, 2).join(":"),
            endTime: end.toTimeString().split(":").slice(0, 2).join(":"),
            priority: taskToEdit.priority,
            label: taskToEdit.label,
            description: taskToEdit.description,
        });
        } else {
        console.warn("Invalid date in taskToEdit:", taskToEdit);
        }
    }
    }, [taskToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const { title, date, startTime, endTime, priority, label, description } = formData;

    if (!title || !date || !endTime || !description) {
      alert("Please fill all required fields");
      return;
    }

    const startDateTime =
      label === "Event" ? `${date}T${startTime}:00` : `${date}T${endTime}:00`;
    const endDateTime = `${date}T${endTime}:00`;

    const updatedTask = {
      title,
      label,
      priority,
      description,
      startDate: startDateTime,
      endDate: endDateTime,
    };

    try {
      const result = await updateTask(taskToEdit._id, updatedTask, token);
      if (result) {
        onTaskUpdated({ ...taskToEdit, ...updatedTask });
        onClose();
      }
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  return (
    <form className={style.form} onSubmit={handleSubmit}>
      <div className={style.header}>
        <button type="button" className={style.closeButton} onClick={onClose}>
          ×
        </button>
        <h3>Edit {formData.label}</h3>
      </div>

      <div className={style.optionContainer}>
        <span className={style.optionLabel}>Type:</span>
        <div className={style.optionGroup}>
          {["Task", "Event"].map((type) => (
            <button
              key={type}
              type="button"
              className={`${style.optionButton} ${formData.label === type ? style.active : ""}`}
              onClick={() => setFormData((prev) => ({ ...prev, label: type }))}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <input
        className={style.field}
        type="text"
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
        required
      />

      <input
        className={style.field}
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        required
      />

      {formData.label === "Event" && (
        <input
          className={style.field}
          type="time"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
          required
        />
      )}

      <input
        className={style.field}
        type="time"
        name="endTime"
        value={formData.endTime}
        onChange={handleChange}
        required
      />

      <div className={style.optionContainer}>
        <span className={style.optionLabel}>Priority:</span>
        <select
          id="priority"
          name="priority"
          className={style.select}
          value={formData.priority}
          onChange={handleChange}
        >
          {["Low", "Medium", "High"].map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </div>

      <textarea
        className={style.description}
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        required
      />

      <button className={style.submitButton} type="submit">
        Save Changes
      </button>
    </form>
  );
};

EditTask.propTypes = {
  taskToEdit: PropTypes.object.isRequired,
  onTaskUpdated: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default EditTask;
