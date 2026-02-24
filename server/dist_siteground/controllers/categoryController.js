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
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getAllCategories = void 0;
const client_1 = require("@prisma/client");
const logger_1 = require("../utils/logger");
const webhooks_1 = require("../utils/webhooks");
const prisma = new client_1.PrismaClient();
const getAllCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield prisma.category.findMany();
        res.json(categories);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching categories', error });
    }
});
exports.getAllCategories = getAllCategories;
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { id, name, icon } = req.body;
        if (!id || !name) {
            return res.status(400).json({ message: 'El ID y el Nombre son obligatorios' });
        }
        const category = yield prisma.category.create({
            data: { id, name, icon: icon || 'Package' }
        });
        yield (0, logger_1.logAudit)(userId, 'CREATE', 'Category', id, null, category);
        yield (0, webhooks_1.triggerWebhook)('CREATE', 'Category', category);
        res.status(201).json(category);
    }
    catch (error) {
        console.error('CRITICAL Error in createCategory:', error);
        res.status(500).json({
            message: 'Error al crear la categoría: ' + (error.code === 'P2002' ? 'El ID ya existe' : error.message),
            error
        });
    }
});
exports.createCategory = createCategory;
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { id } = req.params;
        const categoryId = typeof id === 'string' ? id : id[0];
        const { name, icon } = req.body;
        const oldCategory = yield prisma.category.findUnique({ where: { id: categoryId } });
        const category = yield prisma.category.update({
            where: { id: categoryId },
            data: { name, icon }
        });
        yield (0, logger_1.logAudit)(userId, 'UPDATE', 'Category', categoryId, oldCategory, category);
        yield (0, webhooks_1.triggerWebhook)('UPDATE', 'Category', category);
        res.json(category);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating category', error });
    }
});
exports.updateCategory = updateCategory;
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { id } = req.params;
        const categoryId = typeof id === 'string' ? id : id[0];
        const oldCategory = yield prisma.category.findUnique({ where: { id: categoryId } });
        yield prisma.category.delete({
            where: { id: categoryId }
        });
        yield (0, logger_1.logAudit)(userId, 'DELETE', 'Category', categoryId, oldCategory, null);
        yield (0, webhooks_1.triggerWebhook)('DELETE', 'Category', { id: categoryId });
        res.json({ message: 'Category deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting category', error });
    }
});
exports.deleteCategory = deleteCategory;
