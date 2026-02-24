import { Router } from 'express';
import * as categoryController from '../controllers/categoryController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', categoryController.getAllCategories);

// Admin routes
router.post('/admin', authMiddleware, adminMiddleware, categoryController.createCategory);
router.patch('/admin/:id', authMiddleware, adminMiddleware, categoryController.updateCategory);
router.delete('/admin/:id', authMiddleware, adminMiddleware, categoryController.deleteCategory);

export default router;
