import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

const url: string | undefined = process.env.MONGO_URI;
// = process.env.MONGO_URI as string;
let connection: typeof mongoose;

/**
 * Makes a connection to a MongoDB database. If a connection already exists, does nothing
 * Call this function at the start of api routes and data fetches
 * @returns {Promise<typeof mongoose>}
 */
// const connectDB = async () => {
//   if (!connection) {
//     connection = await mongoose.connect(url);
//     return connection;
//   }
// };

const connectDB = async (): Promise<typeof mongoose | undefined> => {
  if (!url) {
    console.error("❌ MONGO_URI is not set in environment variables.");
    process.exit(1);
  }

  if (!connection) {
    connection = await mongoose.connect(url);
    console.log("✅ MongoDB connected.");
  }

  return connection;
};

export default connectDB;
