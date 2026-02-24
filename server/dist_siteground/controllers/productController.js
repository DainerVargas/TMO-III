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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = exports.getStockMovements = exports.updateStock = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getAdminProducts = exports.getAllProducts = void 0;
const client_1 = require("@prisma/client");
const logger_1 = require("../utils/logger");
const webhooks_1 = require("../utils/webhooks");
const prisma = new client_1.PrismaClient();
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Fetching all active products...');
        const products = yield prisma.product.findMany({
            include: { category: true },
            where: { isActive: true },
            orderBy: { id: 'desc' } // Changed from createdAt to id to test if createdAt has issues
        });
        console.log(`Successfully fetched ${products.length} products`);
        res.json(products);
    }
    catch (error) {
        console.error('CRITICAL: Error in getAllProducts:', error);
        res.status(500).json({
            message: 'Error fetching products',
            error: error.message,
            code: error.code,
            meta: error.meta
        });
    }
});
exports.getAllProducts = getAllProducts;
const getAdminProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield prisma.product.findMany({
            include: { category: true },
            orderBy: [
                { isActive: 'desc' },
                { id: 'desc' }
            ]
        });
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching admin products', error });
    }
});
exports.getAdminProducts = getAdminProducts;
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        // Strip out fields that shouldn't be in the creation data
        const _a = req.body, { id, category, stockmovement, orderitem } = _a, data = __rest(_a, ["id", "category", "stockmovement", "orderitem"]);
        // Explicitly check for categoryId
        if (!data.categoryId) {
            return res.status(400).json({ message: 'La categoría es obligatoria' });
        }
        const product = yield prisma.product.create({
            data: Object.assign({}, data),
            include: { category: true }
        });
        yield (0, logger_1.logAudit)(userId, 'CREATE', 'Product', product.id.toString(), null, product);
        yield (0, webhooks_1.triggerWebhook)('CREATE', 'Product', product);
        res.status(201).json(product);
    }
    catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({
            message: 'Error al crear el producto. Verifique los campos obligatorios.',
            error: error.message,
            code: error.code
        });
    }
});
exports.createProduct = createProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { id } = req.params;
        const productId = parseInt(id);
        // Strip out fields that shouldn't be in the update data
        const _a = req.body, { id: bodyId, category, stockmovement, orderitem, createdAt, updatedAt } = _a, updateData = __rest(_a, ["id", "category", "stockmovement", "orderitem", "createdAt", "updatedAt"]);
        const oldProduct = yield prisma.product.findUnique({ where: { id: productId } });
        if (!oldProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        const product = yield prisma.product.update({
            where: { id: productId },
            data: updateData,
            include: { category: true }
        });
        yield (0, logger_1.logAudit)(userId, 'UPDATE', 'Product', productId.toString(), oldProduct, product);
        yield (0, webhooks_1.triggerWebhook)('UPDATE', 'Product', product);
        res.json(product);
    }
    catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({ message: 'Error updating product', error });
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { id } = req.params;
        const productId = parseInt(id);
        const product = yield prisma.product.findUnique({
            where: { id: productId },
            include: { orderitem: true }
        });
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        // If product has been ordered, we only do a soft delete to keep history
        if (product.orderitem.length > 0) {
            yield prisma.product.update({
                where: { id: productId },
                data: { isActive: false }
            });
            yield (0, logger_1.logAudit)(userId, 'DELETE_SOFT', 'Product', productId.toString(), product, { isActive: false });
            return res.json({ message: 'Producto desactivado (tiene historial de pedidos)' });
        }
        // Otherwise, we can do a hard delete
        // First delete related stock movements
        yield prisma.stockmovement.deleteMany({
            where: { productId }
        });
        // Then delete the product
        yield prisma.product.delete({
            where: { id: productId }
        });
        yield (0, logger_1.logAudit)(userId, 'DELETE_HARD', 'Product', productId.toString(), product, null);
        yield (0, webhooks_1.triggerWebhook)('DELETE', 'Product', { id: productId, deleted: true });
        res.json({ message: 'Producto eliminado permanentemente' });
    }
    catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({ message: 'Error al eliminar producto', error });
    }
});
exports.deleteProduct = deleteProduct;
const updateStock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { id } = req.params;
        const productId = parseInt(id);
        const { quantity, type, reason } = req.body; // quantity can be positive or negative
        const currentProduct = yield prisma.product.findUnique({ where: { id: productId } });
        if (!currentProduct)
            return res.status(404).json({ message: 'Producto no encontrado' });
        const newStock = Math.max(0, currentProduct.stock + quantity);
        let stockStatus = 'in-stock';
        if (newStock === 0)
            stockStatus = 'out-of-stock';
        else if (newStock <= 10)
            stockStatus = 'low-stock';
        const [updatedProduct] = yield prisma.$transaction([
            prisma.product.update({
                where: { id: productId },
                data: { stock: newStock, stockStatus }
            }),
            prisma.stockmovement.create({
                data: {
                    productId,
                    quantity,
                    type,
                    reason
                }
            })
        ]);
        yield (0, logger_1.logAudit)(userId, 'UPDATE_STOCK', 'Product', productId.toString(), { stock: currentProduct.stock }, { stock: newStock, type, reason });
        yield (0, webhooks_1.triggerWebhook)('UPDATE_STOCK', 'Product', { id: productId, stock: newStock });
        res.json(updatedProduct);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating stock', error });
    }
});
exports.updateStock = updateStock;
const getStockMovements = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const movements = yield prisma.stockmovement.findMany({
            include: { product: { select: { name: true, sku: true } } },
            orderBy: { createdAt: 'desc' },
            take: 100
        });
        res.json(movements);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching stock movements', error });
    }
});
exports.getStockMovements = getStockMovements;
const uploadImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No se subió ninguna imagen' });
        }
        const imageUrl = `/uploads/${req.file.filename}`;
        res.json({ imageUrl });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al subir imagen', error });
    }
});
exports.uploadImage = uploadImage;
