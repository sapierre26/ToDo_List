const cors = require("cors");
const express = require("express");
// import express from "express";
// import cors from "cors";
// import userEndpoints from "./routes/userRoutes.js";
// import tasksEndpoints from "./routes/tasksRoutes.js";

const app = express();
module.exports = app;
app.use(express.json());
app.use(cors());

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

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
