import { Router } from 'express';
import * as settingsController from '../controllers/settingsController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', settingsController.getAllSettings);
router.get('/stats', settingsController.getStats);

// Admin routes
router.post('/', authMiddleware, adminMiddleware, settingsController.updateSetting);
router.get('/audit', authMiddleware, adminMiddleware, settingsController.getAuditLogs);

export default router;
