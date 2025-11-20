import { Response } from 'express';

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

const success = <T>(res: Response, message: string, data?: T, statusCode: number = 200): void => {
  res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

const error = (res: Response, message: string, statusCode: number = 500): void => {
  res.status(statusCode).json({
    success: false,
    error: message
  });
};

const badRequest = (res: Response, message: string): void => {
  error(res, message, 400);
};

const unauthorized = (res: Response, message: string = 'Unauthorized'): void => {
  error(res, message, 401);
};

const notFound = (res: Response, message: string = 'Not found'): void => {
  error(res, message, 404);
};

export default {
  success,
  error,
  badRequest,
  unauthorized,
  notFound
};