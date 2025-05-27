const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

function makeNewConnection(url) {
  if (!url) {
    console.error("MONGO_URI is not set in the environment variables.");
    process.exit(1); // Terminate the process if MONGO_URI is missing
    return;
  }

  const connection = mongoose.createConnection(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  let DBname;
  if (url.startsWith("mongodb://")) {
    DBname = url.split("/").pop().split("?")[0];
  } else {
    DBname = url.substring(url.lastIndexOf("net/") + 4, url.lastIndexOf("?"));
  }

  if (process.env.NODE_ENV !== "test") {
    connection.on("connected", () => {
      console.log(`MongoDB :: connected :: ${DBname}`);
    });

    connection.on("disconnected", () => {
      console.log("MongoDB :: disconnected");
    });
    // needs error checking
    mongoose.connection.on("error", (err) => {
      console.log(err);
    });
  }

  return connection;
}

// console.log(process.env.userDB)

module.exports = { makeNewConnection };
