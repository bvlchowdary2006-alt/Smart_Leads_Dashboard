import mongoose from "mongoose";
import config from "./env";

const connectDatabase = async (): Promise<void> => {
  try {
    const connection = await mongoose.connect(config.mongoUri);
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDatabase;
