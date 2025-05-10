import PropTypes from "prop-types";

import { useState, useEffect } from "react";
import style from "./addTask.module.css";
import { addTask } from "../../api/tasks";

const AddTask = ({ taskDate, onTaskAdded, onClose }) => {
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
    if (taskDate) {
      setFormData((prev) => ({
        ...prev,
        date: taskDate.toISOString().split("T")[0],
      }));
    }
  }, [taskDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, date, startTime, endTime, priority, label, description } =
      formData;

    if (!title || !date || !endTime || !description) {
      alert("Please fill all required fields");
      return;
    }

    const startDateTime =
      label === "Event" ? `${date}T${startTime}:00` : `${date}T${endTime}:00`;

    const endDateTime = `${date}T${endTime}:00`;

    try {
      const newTask = {
        title,
        label,
        priority,
        description,
        startDate: startDateTime,
        endDate: endDateTime,
      };

      const success = await addTask(newTask);
      if (success) {
        onTaskAdded({ ...newTask, _id: Date.now().toString() });
        onClose();
      }
    } catch (err) {
      console.error("Error creating task:", err);
    }
  };

  return (
    <form className={style.form} onSubmit={handleSubmit}>
      <div className={style.header}>
        <button type="button" className={style.closeButton} onClick={onClose}>
          ×
        </button>
        <h3>Add {formData.label}</h3>
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
        placeholder={formData.label === "Event" ? "End Time" : "Time"}
      />

      <div className={style.optionContainer}>
        <span className={style.optionLabel}>Priority:</span>
        <div className={style.optionGroup}>
          {["Low", "Medium", "High"].map((level) => (
            <button
              key={level}
              type="button"
              className={`${style.optionButton} ${formData.priority === level ? style.active : ""}`}
              onClick={() =>
                setFormData((prev) => ({ ...prev, priority: level }))
              }
            >
              {level}
            </button>
          ))}
        </div>
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
        Submit {formData.label}
      </button>
    </form>
  );
};

AddTask.propTypes = {
  taskDate: PropTypes.instanceOf(Date),
  onTaskAdded: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AddTask;
