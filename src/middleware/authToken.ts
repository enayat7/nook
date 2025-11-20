import { Request, Response, NextFunction } from 'express';
import AuthRepository from '../features/auth-service/repositories/authRepository';
import { ResponseUtils } from '../utils/generic';

export interface AuthRequest extends Request {
  user?: any;
  auth?: any;
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const apiToken = req.header('Authorization')?.replace('Bearer ', '') || req.header('X-API-Token');
    
    if (!apiToken) {
      return ResponseUtils.unauthorized(res, 'API token required');
    }

    const authData = await AuthRepository.findActiveAuth(apiToken);
    
    if (!authData) {
      return ResponseUtils.unauthorized(res, 'Invalid or expired token');
    }

    req.user = authData.user;
    req.auth = authData.auth;
    next();
  } catch (error) {
    ResponseUtils.unauthorized(res, 'Authentication failed');
  }
};