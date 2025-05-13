// server.js
const express = require("express");
const cors = require("cors");
const connectDB = require("./db.js");
const authRoutes = require("./routes/authRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const tasksRoutes = require("./routes/tasksRoutes.js");
require("dotenv").config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Logger middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", tasksRoutes);

// Root
app.get("/", (req, res) => {
  res.status(200).send("To-Do List Root");
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));