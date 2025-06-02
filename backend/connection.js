// backend/connection.js
const mongoose = require("mongoose");

function makeNewConnection(url) {
  if (!url) {
    console.error("MONGO_URI is not set in the environment variables.");
    if (process.env.NODE_ENV !== "test") {
      process.exit(1);
    }
    return null;
  }

  let DBname;
  if (url.startsWith("mongodb://")) {
    DBname = url.split("/").pop().split("?")[0];
  } else {
    DBname = url.substring(url.lastIndexOf("net/") + 4, url.lastIndexOf("?"));
  }

  const connection = mongoose.createConnection(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  if (process.env.NODE_ENV !== "test") {
    connection.on("connected", () => {
      console.log(`MongoDB :: connected :: ${DBname}`);
    });
    connection.on("disconnected", () => {
      console.log("MongoDB :: disconnected");
    });
    connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });
  }

  return connection;
}

module.exports = { makeNewConnection };
