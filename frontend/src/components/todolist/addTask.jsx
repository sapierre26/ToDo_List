import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import style from "./addTask.module.css";
import { addTask } from "../../api/tasks";

const AddTask = ({ taskDate, onTaskAdded, onClose, isCompact = false }) => {
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
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      const newTask = {
        title,
        label,
        priority,
        description,
        startDate: startDateTime,
        endDate: endDateTime,
      };

      const success = await addTask(newTask, token);
      if (success) {
        onTaskAdded({ ...newTask, _id: Date.now().toString() });
        onClose();
      }
    } catch (err) {
      console.error("Error creating task:", err);
    }
  };

  return (
    <form
      className={`${style.form} ${isCompact ? style.compactForm : ""}`}
      onSubmit={handleSubmit}
    >
      <button type="button" className={style.closeButton} onClick={onClose}>
        ×
      </button>
      <h3>Add {formData.label}</h3>

      <div className={style.formRow}>
        <label className={style.formLabel}>Type:</label>
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

      <div className={style.formRow}>
        <label className={style.formLabel}>Priority:</label>
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
        Submit
      </button>
    </form>
  );
};

AddTask.propTypes = {
  taskDate: PropTypes.instanceOf(Date),
  onTaskAdded: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  isCompact: PropTypes.bool.isRequired,
};

export default AddTask;
