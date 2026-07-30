import { Router } from 'express';
import { AIController } from '../controllers/ai.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/cover-letter', AIController.coverLetter);
router.post('/analyze-job', AIController.analyzeJob);
router.post('/improve-cv', AIController.improveCv);
router.post('/interview-questions', AIController.interviewQuestions);

export default router;