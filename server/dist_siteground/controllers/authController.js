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
exports.updatePassword = exports.updateProfile = exports.getProfile = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, name, lastName, phone, documentType, documentNumber, companyName, role } = req.body;
        const existingUser = yield prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const user = yield prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                lastName,
                phone,
                documentType,
                documentNumber,
                companyName,
                role: role || 'USER',
            },
        });
        const permissionsArray = user.permissions ? user.permissions.split(',').map((p) => p.trim()) : [];
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role, permissions: permissionsArray }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                lastName: user.lastName,
                phone: user.phone,
                documentType: user.documentType,
                documentNumber: user.documentNumber,
                companyName: user.companyName,
                shippingAddress: user.shippingAddress,
                shippingDistrict: user.shippingDistrict,
                shippingReference: user.shippingReference,
                role: user.role,
                permissions: user.permissions ? user.permissions.split(',').map((p) => p.trim()) : [],
            },
            token,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al registrar usuario', error });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        const isValidPassword = yield bcryptjs_1.default.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }
        const permissionsArray = user.permissions ? user.permissions.split(',').map((p) => p.trim()) : [];
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role, permissions: permissionsArray }, JWT_SECRET, { expiresIn: '7d' });
        res.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                lastName: user.lastName,
                phone: user.phone,
                documentType: user.documentType,
                documentNumber: user.documentNumber,
                companyName: user.companyName,
                shippingAddress: user.shippingAddress,
                shippingDistrict: user.shippingDistrict,
                shippingReference: user.shippingReference,
                role: user.role,
                permissions: user.permissions ? user.permissions.split(',').map((p) => p.trim()) : [],
            },
            token,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al iniciar sesión', error });
    }
});
exports.login = login;
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const user = yield prisma.user.findUnique({
            where: { id: userId },
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
                shippingAddress: true,
                shippingDistrict: true,
                shippingReference: true,
                ruc: true,
                permissions: true,
            },
        });
        if (!user)
            return res.status(404).json({ message: 'Usuario no encontrado' });
        // Normalize permissions to array
        const userWithArrayPermissions = Object.assign(Object.assign({}, user), { permissions: user.permissions ? user.permissions.split(',').map((p) => p.trim()) : [] });
        res.json(userWithArrayPermissions);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener perfil', error });
    }
});
exports.getProfile = getProfile;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { name, lastName, phone, documentType, documentNumber, companyName, shippingAddress, shippingDistrict, shippingReference } = req.body;
        const user = yield prisma.user.update({
            where: { id: userId },
            data: { name, lastName, phone, documentType, documentNumber, companyName, shippingAddress, shippingDistrict, shippingReference },
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
                shippingAddress: true,
                shippingDistrict: true,
                shippingReference: true,
                permissions: true,
            },
        });
        const userWithArrayPermissions = Object.assign(Object.assign({}, user), { permissions: user.permissions ? user.permissions.split(',').map((p) => p.trim()) : [] });
        res.json({ user: userWithArrayPermissions, message: 'Perfil actualizado correctamente' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al actualizar perfil', error });
    }
});
exports.updateProfile = updateProfile;
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { currentPassword, newPassword } = req.body;
        const user = yield prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            return res.status(404).json({ message: 'Usuario no encontrado' });
        const isValid = yield bcryptjs_1.default.compare(currentPassword, user.password);
        if (!isValid)
            return res.status(401).json({ message: 'Contraseña actual incorrecta' });
        const hashed = yield bcryptjs_1.default.hash(newPassword, 10);
        yield prisma.user.update({ where: { id: userId }, data: { password: hashed } });
        res.json({ message: 'Contraseña actualizada correctamente' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al cambiar contraseña', error });
    }
});
exports.updatePassword = updatePassword;
