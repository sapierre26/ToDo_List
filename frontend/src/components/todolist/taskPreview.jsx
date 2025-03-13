import React from 'react';
import style from './taskPreview.module.css';
// import { Task }  from "../../../../backend/models/taskSchema";

export default function TaskPreview({ date, title, priority, label, description }) {
    return (
        <main> 
            <div className={style.taskPreview}>
                <p className={style.taskDate}>{date}</p>
                <h3 className={style.taskTitle}>{title}</h3>
                <p className={style.taskPriority}>{priority}</p>
                <p className={style.taskDate}>{label}</p>
                <p className={style.taskDescription}>{description}</p>
            </div>
        </main>
    );
};