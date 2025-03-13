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
