// Define a type for the task (adjust according to your task schema)
export interface Task {
  _id: string;
  date: string;
  title: string;
  label: string;
  priority: string;
  description?: string;
}

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

export const addTask = async (task: Task): Promise<boolean> => {
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
    });

    // Check if the response is OK (status code 200-299)
    if (!res.ok) {
      // If not, throw an error with the status and message
      const response = await res.json();
      console.error(
        `Failed to add task: ${response.message || res.statusText}`
      );
      return false; // Return false if the task was not added successfully
    }

    // If the task was added successfully
    console.log("Task added successfully!");
    return true;
  } catch (error) {
    // Log any errors that occur during the fetch or handling process
    console.error("Error adding task:", error);
    return false; // Return false if an error occurs
  }
};
