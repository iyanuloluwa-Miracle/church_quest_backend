import mongoose from 'mongoose';
import { environment } from './environment';
import logger from '../utils/logger';

/**
 * Connect to MongoDB database
 */
export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(environment.mongodbUri);
    logger.info('Connected to MongoDB database');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

/**
 * Disconnect from MongoDB database
 */
export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB database');
  } catch (error) {
    logger.error('MongoDB disconnection error:', error);
    process.exit(1);
  }
};