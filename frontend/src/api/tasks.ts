// Define a type for the task (adjust according to your task schema)
export interface Task  {
    _id: string;
    date: string;
    title: string; 
    label: string;
    priority: string;
    description?: string;
};

const tasksURL: string = "http://localhost:8000/api/tasks";

export const getTasks = async (): Promise<Task[] | null> => {
    try {
        const res = await fetch(tasksURL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            cache: "no-store", 
        });

        // Check if the response is OK (status code 200-299)
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        // Parse the JSON response
        const tasks: Task[] = await res.json();
        console.log("Fetched tasks:", tasks); // Remove this log in production if not necessary

        return tasks;
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return null;
    }
};

export const addTask = async (task: Task) => {
    try {
        const res = await fetch(tasksURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            cache: "no-store", 
            body: JSON.stringify({
                _id: task._id,
                date: task.date,
                title: task.title, 
                label: task.label,
                priority: task.priority,
                description: task.description,
            }),
        })
        .then(async (res) => {
            const response = await res.json();
            console.log(res.ok);
            if (!res.ok) {
              // check server response
              throw new Error(res.status + "-" + res.statusText)
            }
            return true;
          })
          .catch((error) => {
            console.error("Error: ", error);
            return false;
          });
        } catch (error) {
            console.error("Error fetching tasks:", error);
            return null;
        }
    };

export const getTaskByID = async (date: string): Promise<Task | null> => {
    try {
        const res = await fetch(`${tasksURL}/${date}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            cache: "no-store",
        });

        // Check if the response is OK (status code 200-299)
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        // Parse the JSON response
        const task: Task = await res.json();
        console.log("Fetched task:", task); // Remove this log in production if not necessary

        return task;
    } catch (error) {
        console.error(`Error fetching task with ID ${date}:`, error);
        return null;
    }
};



export const deleteTask = async (taskId: string): Promise<boolean> => {
        try {
          const res = await fetch(`${tasksURL}/${taskId}`, {  // Ensure the taskId is correct in the URL
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            cache: "no-store",
          });
      
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
          const data = await res.json();  // Handle the response body
          console.log(data.message);  // Log success message
      
          return true;
        } catch (error) {
          console.error(`Error deleting task with ID ${taskId}:`, error);
          return false;
        }
      };
      