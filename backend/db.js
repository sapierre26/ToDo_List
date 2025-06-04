const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  if (process.env.NODE_ENV === "test") {
    return;
  }

  if (!process.env.MONGO_URI) {
    console.error("MongoDB connection error: MONGO_URI is missing");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected.");
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = connectDB;
