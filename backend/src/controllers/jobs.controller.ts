import { Request, Response, NextFunction } from 'express';
import { JobsService } from '../services/jobs.service';

interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

export const JobsController = {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const filters = {
        status: req.query.status as any,
        search: req.query.search as string,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
      };
      const result = await JobsService.getAll(req.user!.id, filters);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params['id'] as string);
      const job = await JobsService.getById(id, req.user!.id);
      res.json({ success: true, data: job });
    } catch (error) {
      next(error);
    }
  },

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const job = await JobsService.create(req.user!.id, req.body);
      res.status(201).json({ success: true, data: job });
    } catch (error) {
      next(error);
    }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params['id'] as string);
      const job = await JobsService.update(id, req.user!.id, req.body);
      res.json({ success: true, data: job });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params['id'] as string);
      await JobsService.delete(id, req.user!.id);
      res.json({ success: true, message: 'Job deleted successfully' });
    } catch (error) {
      next(error);
    }
  },

  async getStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const stats = await JobsService.getStats(req.user!.id);
      res.json({ success: true, data: stats });
    } catch (error) {
      next(error);
    }
  },
};
