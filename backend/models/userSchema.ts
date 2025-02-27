import mongoose, { Schema } from "mongoose";

// Define and export User schema
export type User = {
    name: String;
    password: String;
};

// Can add more fields later if needed
const userSchema = new Schema<User>({
    name: { type: String, required: true },
    password: { type: String, required: true },
});

const User = mongoose.models['user'] || mongoose.model('user', userSchema);

export default User;