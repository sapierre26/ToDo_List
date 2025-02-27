import mongoose, { Schema } from "mongoose";

export type Task = {
    date: string;
    title: string; 
    description: string;
};

const taskSchema = new Schema<Task>({
    date: { type: String, required: true },
    title: { type: String, required: true},
    description: { type: String, required: false},
});

const Task = mongoose.models['tasks'] || mongoose.model('tasks', taskSchema);

// whenever task is called
// async function getTasks(){
//     await connectDB()
//     try {
//         const tasks = await Task.find().orFail()
//         return tasks
//     } catch (err) {
//         return null
//     }
// }

export default Task;