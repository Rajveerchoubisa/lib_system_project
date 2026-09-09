import mongoose from "mongoose";

let connectionPromise;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is not configured");
  connectionPromise ||= mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
  try {
    const conn = await connectionPromise;
    return conn.connection;
  } catch (error) {
    connectionPromise = undefined;
    throw error;
  }
};

export default connectDB;



