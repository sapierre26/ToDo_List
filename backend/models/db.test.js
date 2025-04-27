const express = require("express");
const cors = require("cors");
const db = require("./db")
const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
}); 

app.get("/users", async (req, res) => {
    const name = req.query["name"];
    
})