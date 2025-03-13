import { NextFunction, Request, Response } from 'express';
// import User from './models/userSchema';
const express = require("express") 
const app = express() 
app.use(express.json())

const userEndpoints = require("./routes/userRoutes.ts")
const tasksEndpoints = require("./routes/tasksRoutes.ts")


app.use("/api/Users", userEndpoints)
app.use("/api/tasks", tasksEndpoints)
app.use((req: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,DELETE,PUT');
    next();
});


//testing middleware
function loggerMiddleware(request: Request, response: Response, next: NextFunction) {
    console.log(`${request.method} ${request.path}`);
    next();
}

//logs testing middleware to console
app.use(loggerMiddleware)


app.get('/', (req: Request, res: Response) => {
    res.status(200)
    res.send('To-do List Root')
})

app.listen(5173) 