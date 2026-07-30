import { Request, Response, NextFunction } from 'express';
import { AIService } from '../services/ai.service';
import { AppError } from '../middleware/error.middleware';

export const AIController = {
  async coverLetter(req: Request, res: Response, next: NextFunction) {
    try {
      const { company, position, jobDescription, userBackground } = req.body;
      if (!company || !position) {
        throw new AppError('Company and position are required', 400);
      }
      const result = await AIService.generateCoverLetter({ company, position, jobDescription, userBackground });
      res.json({ success: true, data: { result } });
    } catch (error) {
      next(error);
    }
  },

  async analyzeJob(req: Request, res: Response, next: NextFunction) {
    try {
      const { jobDescription } = req.body;
      if (!jobDescription) {
        throw new AppError('Job description is required', 400);
      }
      const result = await AIService.analyzeJobDescription(jobDescription);
      res.json({ success: true, data: { result } });
    } catch (error) {
      next(error);
    }
  },

  async improveCv(req: Request, res: Response, next: NextFunction) {
    try {
      const { cvText, targetRole } = req.body;
      if (!cvText) {
        throw new AppError('CV text is required', 400);
      }
      const result = await AIService.improveCv(cvText, targetRole);
      res.json({ success: true, data: { result } });
    } catch (error) {
      next(error);
    }
  },

  async interviewQuestions(req: Request, res: Response, next: NextFunction) {
    try {
      const { position, company, jobDescription } = req.body;
      if (!position) {
        throw new AppError('Position is required', 400);
      }
      const result = await AIService.generateInterviewQuestions({ position, company, jobDescription });
      res.json({ success: true, data: { result } });
    } catch (error) {
      next(error);
    }
  },
};