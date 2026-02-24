"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.getAdminOrders = exports.getMyOrders = exports.createOrder = void 0;
const client_1 = require("@prisma/client");
const logger_1 = require("../utils/logger");
const webhooks_1 = require("../utils/webhooks");
const prisma = new client_1.PrismaClient();
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, total, items } = req.body;
        const order = yield prisma.order.create({
            data: {
                userId,
                total,
                status: 'PENDING',
                orderItems: {
                    create: items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                },
            },
            include: { orderItems: true },
        });
        res.status(201).json(order);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating order', error });
    }
});
exports.createOrder = createOrder;
const getMyOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const orders = yield prisma.order.findMany({
            where: { userId },
            include: {
                orderItems: {
                    include: { product: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error });
    }
});
exports.getMyOrders = getMyOrders;
const getAdminOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield prisma.order.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        lastName: true,
                        email: true,
                        phone: true,
                        documentNumber: true,
                        documentType: true,
                    },
                },
                orderItems: {
                    include: {
                        product: {
                            select: { name: true, sku: true, unit: true },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching admin orders', error });
    }
});
exports.getAdminOrders = getAdminOrders;
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminId = req.userId;
        const { id } = req.params;
        const orderId = typeof id === 'string' ? id : id[0];
        const { status } = req.body;
        const oldOrder = yield prisma.order.findUnique({ where: { id: parseInt(orderId) } });
        const order = yield prisma.order.update({
            where: { id: parseInt(orderId) },
            data: { status },
        });
        yield (0, logger_1.logAudit)(adminId, 'UPDATE_STATUS', 'Order', orderId, { status: oldOrder === null || oldOrder === void 0 ? void 0 : oldOrder.status }, { status: order.status });
        yield (0, webhooks_1.triggerWebhook)('UPDATE_STATUS', 'Order', order);
        res.json(order);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating order status', error });
    }
});
exports.updateOrderStatus = updateOrderStatus;
