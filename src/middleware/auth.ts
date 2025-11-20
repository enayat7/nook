import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  user?: any;
}

// JWT authentication removed - implement alternative auth method if needed
export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  // Authentication middleware disabled
  next();
};