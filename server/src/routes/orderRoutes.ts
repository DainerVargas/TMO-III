import { Router } from 'express';
import { createOrder, getMyOrders, getAdminOrders, updateOrderStatus } from '../controllers/orderController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

// Customer routes
router.post('/', authMiddleware, createOrder);
router.get('/my', authMiddleware, getMyOrders);

// Admin routes
router.get('/admin', authMiddleware, adminMiddleware, getAdminOrders);
router.patch('/:id/status', authMiddleware, adminMiddleware, updateOrderStatus);

export default router;
