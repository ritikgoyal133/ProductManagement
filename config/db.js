import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const connectDB = async () => {
  try {
    // Connect to MongoDB using the URI from environment variables
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database Connected.");
  } catch (error) {
    console.error("Database connection error:", error);
    // Exit the process with a failure code
    process.exit(1);
  }
};

export default connectDB;
