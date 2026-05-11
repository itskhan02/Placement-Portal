const mongoose = require("mongoose");

const isDevelopment = process.env.NODE_ENV === "development";

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);

    console.log("MongoDB successfully connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);

    process.exit(1);
  }
}

module.exports = connectDB;
