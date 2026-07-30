import { Router } from 'express';
import { JobsController } from '../controllers/jobs.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/stats', JobsController.getStats);
router.get('/', JobsController.getAll);
router.get('/:id', JobsController.getById);
router.post('/', JobsController.create);
router.put('/:id', JobsController.update);
router.delete('/:id', JobsController.delete);

export default router;