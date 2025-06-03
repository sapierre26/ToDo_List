const mongoose = require("mongoose");

function makeNewConnection(url) {
  if (!url) {
    if (process.env.NODE_ENV === "test") {
      throw new Error("MONGO_URI must be provided in test environment");
    }
    console.error("MONGO_URI is not set in the environment variables.");
    process.exit(1);
    return;
  }

  if (
    process.env.NODE_ENV !== "test" &&
    (typeof url !== "string" ||
      (!url.startsWith("mongodb://") && !url.startsWith("mongodb+srv://")))
  ) {
    throw new Error(`Invalid MongoDB connection string: ${url}`);
  }

  let DBname;
  try {
    DBname = new URL(url).pathname.split("/").pop() || "default";
  } catch (e) {
    DBname = "unknown";
  }

  const connection = mongoose.createConnection(url, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
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
