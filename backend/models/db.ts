import mongoose from "mongoose";

const url: string = process.env.MONGO_URI as string;
let connection: typeof mongoose;

const connectDB = async () => {
    if (!connection) {
        connection = await mongoose.connect(url);
        return connection;
    }
};

export default connectDB;