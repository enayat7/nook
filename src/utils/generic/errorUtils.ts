import { logger } from '../logger';

class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const handleError = (error: any, context: string): void => {
  logger.error(`${context}:`, error);
};

const createError = (message: string, statusCode: number = 500): AppError => {
  return new AppError(message, statusCode);
};

const isOperationalError = (error: Error): boolean => {
  if (error instanceof AppError) {
    return error.isOperational;
  }
  return false;
};

export default {
  AppError,
  handleError,
  createError,
  isOperationalError
};