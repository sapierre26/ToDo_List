const tasksURL = "http://localhost:8000/api/tasks";

const formatDate = (date) => {
    return date.toISOString().split('T')[0];
};

export const getTasks = async () => {
    try {
        const res = await fetch(tasksURL);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return await res.json();
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return null;
    }
};

export const getTasksAndEventsByEndDate = async (date) => {
    try {
        const dateStr = formatDate(date);
        const res = await fetch(`${tasksURL}?date=${dateStr}`);
        
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return await res.json();
    } catch (error) {
        console.error("Error fetching tasks by date:", error);
        return null;
    }
};

export const getTasksForMonth = async (startDate, endDate) => {
    try {
        const startStr = formatDate(startDate);
        const endStr = formatDate(endDate);
        const res = await fetch(`${tasksURL}?startDate=${startStr}&endDate=${endStr}`);
        
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return await res.json();
    } catch (error) {
        console.error("Error fetching month tasks:", error);
        return null;
    }
};

export const addTask = async (task) => {
    try {
        const res = await fetch(tasksURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(task)
        });
        
        if (!res.ok) throw new Error(`Failed to add task: ${res.statusText}`);
        return await res.json();
    } catch (error) {
        console.error("Error adding task:", error);
        return null;
    }
};

export const deleteTask = async (taskId) => {
    try {
        const res = await fetch(`${tasksURL}/${taskId}`, { 
            method: "DELETE" 
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return true;
    } catch (error) {
        console.error(`Error deleting task ${taskId}:`, error);
        return false;
    }
};

export const updateTask = async (taskId, updates) => {
    try {
        const res = await fetch(`${tasksURL}/${taskId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates)
        });
        
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return await res.json();
    } catch (error) {
        console.error(`Error updating task ${taskId}:`, error);
        return null;
    }
};
