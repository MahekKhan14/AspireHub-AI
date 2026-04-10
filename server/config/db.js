import mongoose from "mongoose";

let dbConnected = false;

export const connectDatabase = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log("No MONGODB_URI — using file store fallback.");
    return;
  }
  try {
    await mongoose.connect(uri);
    dbConnected = true;
    console.log("✅ MongoDB connected.");
  } catch (err) {
    dbConnected = false;
    console.warn("⚠️ MongoDB failed — using file store fallback:", err.message);
  }
};

export const isDatabaseConnected = () => dbConnected;
