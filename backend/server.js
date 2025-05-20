// server.js
const express = require("express");
const path = require("path");
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
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Root
app.get("/", (req, res) => {
  res.status(200).send("To-Do List Root");
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const userEndpoints = require("./routes/userRoutes.js");
const tasksEndpoints = require("./routes/tasksRoutes.js");

app.use("/api/Users", userEndpoints);
app.use("/api/tasks", tasksEndpoints);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS,DELETE,PUT");
  next();
});

//testing middleware
function loggerMiddleware(request, response, next) {
  console.log(`${request.method} ${request.path}`);
  next();
}

//logs testing middleware to console
app.use(loggerMiddleware);

app.get("/", (req, res) => {
  res.status(200);
  res.send("To-Do List Root");
});
const PORT1 = process.env.PORT || 8005;

if (require.main === module) {
  app.listen(PORT1, () => console.log(`Server running on port ${PORT1}`));
}
module.exports = app;
