// server.js
require("dotenv").config({ path: __dirname + "/.env" });

const express = require("express");
const path = require("path");
const cors = require("cors");
const session = require("express-session");
require("dotenv").config();

const connectDB = require("./db.js");
const authRoutes = require("./routes/authRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const tasksRoutes = require("./routes/tasksRoutes.js");
const googleCalendarRoutes = require("./routes/googleCalendar.js");

const app = express();
const PORT = process.env.PORT || 8000;

// Connect to database
connectDB();

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Session
app.use(
  session({
    secret: process.env.TOKEN_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// Custom headers middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE, PUT");
  next();
});

// Logger middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// ✅ Serve uploaded profile pictures
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", tasksRoutes);
app.use("/api/google-calendar", googleCalendarRoutes);

// Root route
app.get("/", (req, res) => {
  res.status(200).send("To-Do List Root");
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
