// import mongoose, { Schema } from "mongoose";
const mongoose = require("mongoose");
const { makeNewConnection } = require("../connection");

// Define and export User schema
// export type User = {
//     name: String;
//     username: String;
//     password: String;
// };

// Can add more fields later if needed
const userConnection = makeNewConnection(process.env.userDB);
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String },
    image: { type: String },
  },
  { collection: "Users" },
);
const User = userConnection.model("Users", userSchema);

module.exports = User;
