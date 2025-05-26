const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

function makeNewConnection(url) {
  if (!url) {
    console.error("MONGO_URI is not set in the environment variables.");
    process.exit(1); // Terminate the process if MONGO_URI is missing
  }

  const connection = mongoose.createConnection(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const DBname = url.includes("net/") && url.includes("?")
    ? url.substring(url.lastIndexOf("net/") + 4, url.lastIndexOf("?"))
    : url;

  connection.on("connected", () => {
    console.log(`MongoDB :: connected :: ${DBname}`);
  });

  connection.on("disconnected", () => {
    console.log(`MongoDB :: disconnected`);
  });

  //still needs error checking
  mongoose.connection.on("error", (err) => {
    console.log(err);
  });

  return connection;
}

// console.log(process.env.userDB)
let userConnection;
let tasksConnection;

if (process.env.userDB && process.env.tasksDB) {
  userConnection = makeNewConnection(process.env.userDB);
  tasksConnection = makeNewConnection(process.env.tasksDB);
}

module.exports = {makeNewConnection, userConnection, tasksConnection };
