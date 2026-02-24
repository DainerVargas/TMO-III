import { Router } from 'express';
import * as userController from '../controllers/userController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

// Admin routes
router.get('/admin', authMiddleware, adminMiddleware, userController.getAllUsers);
router.post('/admin', authMiddleware, adminMiddleware, userController.createUser);
router.put('/admin/:id', authMiddleware, adminMiddleware, userController.updateUser);
router.patch('/admin/:id/role', authMiddleware, adminMiddleware, userController.updateUserRole);
router.patch('/admin/:id/status', authMiddleware, adminMiddleware, userController.toggleUserStatus);
router.patch('/admin/:id/permissions', authMiddleware, adminMiddleware, userController.updateUserPermissions);

export default router;
