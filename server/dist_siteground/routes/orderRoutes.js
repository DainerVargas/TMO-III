"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = require("../controllers/orderController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Customer routes
router.post('/', auth_1.authMiddleware, orderController_1.createOrder);
router.get('/my', auth_1.authMiddleware, orderController_1.getMyOrders);
// Admin routes
router.get('/admin', auth_1.authMiddleware, auth_1.adminMiddleware, orderController_1.getAdminOrders);
router.patch('/:id/status', auth_1.authMiddleware, auth_1.adminMiddleware, orderController_1.updateOrderStatus);
exports.default = router;
