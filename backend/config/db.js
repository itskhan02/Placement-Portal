const mongoose = require('mongoose');

const isDevelopment = process.env.NODE_ENV === "development";

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    if (isDevelopment) {
      console.log("MongoDB successfully connected");
    }
  } catch(err){
    console.error("connection failed", err);
  }
}

module.exports = connectDB;
