import mongoose from "mongoose";
import { environment } from "./environment";
import logger from "../utils/logger";

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(environment.mongodbUri);
    logger.info("Connected to MongoDB database");
  } catch (error) {
    logger.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
