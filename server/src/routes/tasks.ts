import { Router } from 'express';
import { createTask, getTasks, updateTask, deleteTask } from '../controllers/tasks';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.post('/', createTask);
router.get('/', getTasks);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
