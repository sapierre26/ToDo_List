const mongoose = require("mongoose");

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

module.exports = userSchema;
