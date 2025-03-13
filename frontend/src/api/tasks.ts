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
