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
  const DBname = url.substring(
    url.lastIndexOf("net/") + 4,
    url.lastIndexOf("?"),
  );

  connection.on("connected", function () {
    console.log(`MongoDB :: connected :: ${DBname}`);
  });

  connection.on("disconnected", function () {
    console.log(`MongoDB :: disconnected`);
  });

  //still needs error checking
  mongoose.connection.on("error", (err) => {
    console.log(err);
  });

  return connection;
}

// console.log(process.env.userDB)
const userConnection = makeNewConnection(process.env.userDB);
const tasksConnection = makeNewConnection(process.env.tasksDB);

module.exports = { makeNewConnection, userConnection, tasksConnection };
