import { Router } from 'express';
import { getProfile, getAllUsers, deleteUser } from '../controllers/users';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = Router();

router.get('/profile', authenticateToken, getProfile);
router.get('/admin/users', authenticateToken, authorizeRole(['admin']), getAllUsers);
router.delete('/admin/users/:id', authenticateToken, authorizeRole(['admin']), deleteUser);

export default router;
