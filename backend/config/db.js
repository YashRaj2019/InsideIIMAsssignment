import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

let isMongoConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  
  if (!uri || uri.trim() === '') {
    logger.warn('MONGODB_URI environment variable is missing or empty. Falling back to local JSON file database.');
    isMongoConnected = false;
    return false;
  }

  try {
    logger.info(`Attempting to connect to MongoDB...`);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000 // 5 seconds timeout
    });
    isMongoConnected = true;
    logger.info('Connected to MongoDB successfully.');
    return true;
  } catch (error) {
    logger.error(`Failed to connect to MongoDB (falling back to JSON store): ${error.message}`);
    isMongoConnected = false;
    return false;
  }
};

export const getDbStatus = () => isMongoConnected;
export const setDbStatus = (status) => { isMongoConnected = status; };
