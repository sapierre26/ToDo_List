const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema(
  {
    title: String,
    startDate: { type: Date },
    endDate: { type: Date },
    priority: String,
    label: String,
    description: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { collections: "tasks" },
);

module.exports = taskSchema;
