import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.utils';
import { AppError } from './error.middleware';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

export const authMiddleware = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    next(new AppError('Invalid or expired token', 401));
  }
};
