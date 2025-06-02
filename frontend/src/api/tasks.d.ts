export interface Task {
  _id: string;
  date: string;
  title: string;
  label: string;
  priority: string;
}

export function getTasks(token: string): Promise<Task[] | null>;
export function addTask(task: Task, token: string): Promise<Task | null>;
export function deleteTask(taskId: string): Promise<boolean>;
export function updateTask(taskId: string, updates: Partial<Task>): Promise<Task | null>;
export function getTasksAndEventsByEndDate(date: Date, token: string): Promise<Task[] | null>;
export function getTasksForMonth(startDate: Date, endDate: Date, token: string): Promise<Task[] | null>;
export function getGoogleCalendarEvents(): Promise<any[]>;
export function getGoogleTasks(): Promise<any[]>;
