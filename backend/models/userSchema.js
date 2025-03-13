// import mongoose, { Schema } from "mongoose";
const mongoose = require("mongoose");
const { userConnection } = require("../connection");

// Define and export User schema
// export type User = {
//     name: String;
//     username: String;
//     password: String;
// };

// Can add more fields later if needed
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
}, {collection: "Users" });

const User = userConnection.model("Users", userSchema);

module.exports = User;