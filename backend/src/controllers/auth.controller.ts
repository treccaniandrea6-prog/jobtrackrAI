import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

export const AuthController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.register(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.login(req.body);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await AuthService.getProfile(req.user!.id);
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  },
};
