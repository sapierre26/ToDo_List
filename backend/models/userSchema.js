const mongoose = require("mongoose");
const { makeNewConnection } = require("../connection");

const userConnection = makeNewConnection(process.env.userDB);
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String },
    image: {
      data: Buffer,
      contentType: String,
    },
    theme: { type: String, default: "light" },
    font: { type: String, default: "Arial" },
  },
  { collection: "Users" },
);
const User = userConnection.model("Users", userSchema);

module.exports = User;
