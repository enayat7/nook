import mongoose from 'mongoose';
import { config } from '../config';
import { logger } from '../src/utils/logger';

export class DatabaseConnection {
  private static instance: DatabaseConnection;
  
  private constructor() {}
  
  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }
  
  public async connect(): Promise<void> {
    try {
      await mongoose.connect(config.database.uri, config.database.options);
      logger.info('MongoDB connected successfully');
    } catch (error) {
      logger.error('MongoDB connection error:', error);
      process.exit(1);
    }
  }
  
  public async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      logger.info('MongoDB disconnected');
    } catch (error) {
      logger.error('MongoDB disconnection error:', error);
    }
  }
}

// Handle connection events
mongoose.connection.on('connected', () => {
  logger.info('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  logger.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  logger.info('Mongoose disconnected');
});