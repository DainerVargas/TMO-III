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
exports.getStats = exports.getAuditLogs = exports.updateSetting = exports.getAllSettings = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const settings = yield prisma.globalsettings.findMany();
        res.json(settings);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching settings', error });
    }
});
exports.getAllSettings = getAllSettings;
const updateSetting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { key, value, description } = req.body;
        const setting = yield prisma.globalsettings.upsert({
            where: { key },
            update: { value, description },
            create: { key, value, description }
        });
        res.json(setting);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating setting', error });
    }
});
exports.updateSetting = updateSetting;
const getAuditLogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const logs = yield prisma.auditlog.findMany({
            include: {
                user: {
                    select: { name: true, email: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(logs);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching audit logs', error });
    }
});
exports.getAuditLogs = getAuditLogs;
const getStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [totalProducts, activeProducts, totalCategories, totalUsers, pendingOrders, totalOrders, lowStockProducts, products] = yield Promise.all([
            prisma.product.count(),
            prisma.product.count({ where: { isActive: true } }),
            prisma.category.count(),
            prisma.user.count(),
            prisma.order.count({ where: { status: 'pending' } }),
            prisma.order.count(),
            prisma.product.count({ where: { stock: { lte: 10 }, isActive: true } }),
            prisma.product.findMany({ select: { stock: true, price: true, categoryId: true } })
        ]);
        const totalStockValue = products.reduce((acc, p) => acc + (p.stock * p.price.toNumber()), 0);
        // Get sales for the last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentOrders = yield prisma.order.findMany({
            where: {
                createdAt: { gte: sevenDaysAgo },
                status: { not: 'cancelled' }
            },
            select: {
                createdAt: true,
                total: true
            }
        });
        // Group sales by day
        const dayMap = {};
        const days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
        // Initialize last 7 days
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const label = days[d.getDay()];
            dayMap[label] = { sales: 0, orders: 0 };
        }
        recentOrders.forEach(order => {
            const label = days[order.createdAt.getDay()];
            if (dayMap[label]) {
                dayMap[label].sales += order.total.toNumber();
                dayMap[label].orders += 1;
            }
        });
        const salesHistory = Object.entries(dayMap).map(([name, data]) => (Object.assign({ name }, data)));
        // Category distribution (simplified)
        const catMap = {};
        products.forEach(p => {
            catMap[p.categoryId] = (catMap[p.categoryId] || 0) + 1;
        });
        const topCategories = Object.entries(catMap)
            .map(([id, count]) => ({
            label: id.charAt(0).toUpperCase() + id.slice(1),
            percentage: Math.round((count / totalProducts) * 100),
            color: id === 'oficina' ? 'bg-[#0a4d8c]' : id === 'limpieza' ? 'bg-[#00bcd4]' : 'bg-indigo-500'
        }))
            .sort((a, b) => b.percentage - a.percentage)
            .slice(0, 3);
        res.json({
            totalProducts,
            activeProducts,
            totalCategories,
            totalUsers,
            pendingOrders,
            totalOrders,
            lowStockProducts,
            totalStockValue,
            salesHistory,
            topCategories,
            salesGrowth: "+12.5%", // These could be calculated by comparing with previous period
            orderGrowth: "+8.2%"
        });
    }
    catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ message: 'Error fetching stats', error });
    }
});
exports.getStats = getStats;
