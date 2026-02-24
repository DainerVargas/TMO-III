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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.createUser = exports.updateUserPermissions = exports.toggleUserStatus = exports.updateUserRole = exports.getAllUsers = void 0;
const client_1 = require("@prisma/client");
const logger_1 = require("../utils/logger");
const webhooks_1 = require("../utils/webhooks");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                lastName: true,
                role: true,
                phone: true,
                documentType: true,
                documentNumber: true,
                companyName: true,
                isActive: true,
                permissions: true,
                createdAt: true,
            }
        });
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
});
exports.getAllUsers = getAllUsers;
const updateUserRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminId = req.userId;
        const { id } = req.params;
        const userId = typeof id === 'string' ? parseInt(id) : parseInt(id[0]);
        const { role } = req.body;
        const oldUser = yield prisma.user.findUnique({ where: { id: userId } });
        const user = yield prisma.user.update({
            where: { id: userId },
            data: { role },
            select: { id: true, email: true, name: true, role: true }
        });
        yield (0, logger_1.logAudit)(adminId, 'UPDATE_ROLE', 'User', userId.toString(), { role: oldUser === null || oldUser === void 0 ? void 0 : oldUser.role }, { role: user.role });
        yield (0, webhooks_1.triggerWebhook)('UPDATE_ROLE', 'User', { id: userId, role: user.role });
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating user role', error });
    }
});
exports.updateUserRole = updateUserRole;
const toggleUserStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminId = req.userId;
        const { id } = req.params;
        const userId = typeof id === 'string' ? parseInt(id) : parseInt(id[0]);
        const { isActive } = req.body;
        const oldUser = yield prisma.user.findUnique({ where: { id: userId } });
        const user = yield prisma.user.update({
            where: { id: userId },
            data: { isActive },
            select: { id: true, email: true, name: true, isActive: true }
        });
        yield (0, logger_1.logAudit)(adminId, 'TOGGLE_STATUS', 'User', userId.toString(), { isActive: oldUser === null || oldUser === void 0 ? void 0 : oldUser.isActive }, { isActive: user.isActive });
        yield (0, webhooks_1.triggerWebhook)('TOGGLE_STATUS', 'User', { id: userId, isActive: user.isActive });
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating user status', error });
    }
});
exports.toggleUserStatus = toggleUserStatus;
const updateUserPermissions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminId = req.userId;
        const { id } = req.params;
        const userId = typeof id === 'string' ? parseInt(id) : parseInt(id[0]);
        const { permissions } = req.body; // Expecting string array
        const permissionsString = Array.isArray(permissions) ? permissions.join(',') : permissions;
        const oldUser = yield prisma.user.findUnique({ where: { id: userId } });
        const user = yield prisma.user.update({
            where: { id: userId },
            data: { permissions: permissionsString },
            select: { id: true, email: true, name: true, permissions: true }
        });
        yield (0, logger_1.logAudit)(adminId, 'UPDATE_PERMISSIONS', 'User', userId.toString(), { permissions: oldUser === null || oldUser === void 0 ? void 0 : oldUser.permissions }, { permissions: user.permissions });
        res.json(Object.assign(Object.assign({}, user), { permissions: user.permissions ? user.permissions.split(',').map((p) => p.trim()) : [] }));
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating user permissions', error });
    }
});
exports.updateUserPermissions = updateUserPermissions;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminId = req.userId;
        const { email, password, name, lastName, role, phone, documentType, documentNumber, companyName, permissions } = req.body;
        const existingUser = yield prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const permissionsString = Array.isArray(permissions) ? permissions.join(',') : permissions;
        const user = yield prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                lastName,
                role: role || 'USER',
                phone,
                documentType,
                documentNumber,
                companyName,
                permissions: permissionsString,
                isActive: true
            }
        });
        yield (0, logger_1.logAudit)(adminId, 'CREATE', 'User', user.id.toString(), null, { email, role, name });
        res.status(201).json({ id: user.id, email: user.email, name: user.name });
    }
    catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({ message: 'Error al crear usuario', error: error.message });
    }
});
exports.createUser = createUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminId = req.userId;
        const { id } = req.params;
        const userId = typeof id === 'string' ? parseInt(id) : parseInt(id[0]);
        const { email, name, lastName, phone, documentType, documentNumber, companyName, password } = req.body;
        const oldUser = yield prisma.user.findUnique({ where: { id: userId } });
        if (!oldUser) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        const data = {
            email,
            name,
            lastName,
            phone,
            documentType,
            documentNumber,
            companyName
        };
        if (password && password.trim() !== '') {
            data.password = yield bcryptjs_1.default.hash(password, 10);
        }
        const user = yield prisma.user.update({
            where: { id: userId },
            data
        });
        yield (0, logger_1.logAudit)(adminId, 'UPDATE', 'User', userId.toString(), oldUser, user);
        res.json({ id: user.id, email: user.email, name: user.name });
    }
    catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ message: 'Error al actualizar usuario', error: error.message });
    }
});
exports.updateUser = updateUser;
