import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, lastName, phone, documentType, documentNumber, companyName, role } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
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

    const permissionsArray = (user as any).permissions ? (user as any).permissions.split(',').map((p: string) => p.trim()) : [];
    const token = jwt.sign({ userId: user.id, role: user.role, permissions: permissionsArray }, JWT_SECRET, { expiresIn: '7d' });

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
        shippingAddress: (user as any).shippingAddress,
        shippingDistrict: (user as any).shippingDistrict,
        shippingReference: (user as any).shippingReference,
        role: user.role,
        permissions: (user as any).permissions ? (user as any).permissions.split(',').map((p: string) => p.trim()) : [],
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar usuario', error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const permissionsArray = (user as any).permissions ? (user as any).permissions.split(',').map((p: string) => p.trim()) : [];
    const token = jwt.sign({ userId: user.id, role: user.role, permissions: permissionsArray }, JWT_SECRET, { expiresIn: '7d' });

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
        shippingAddress: (user as any).shippingAddress,
        shippingDistrict: (user as any).shippingDistrict,
        shippingReference: (user as any).shippingReference,
        role: user.role,
        permissions: (user as any).permissions ? (user as any).permissions.split(',').map((p: string) => p.trim()) : [],
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const user = await prisma.user.findUnique({
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
      } as any,
    });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    
    // Normalize permissions to array
    const userWithArrayPermissions = {
      ...user,
      permissions: (user as any).permissions ? (user as any).permissions.split(',').map((p: string) => p.trim()) : []
    };
    
    res.json(userWithArrayPermissions);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener perfil', error });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { name, lastName, phone, documentType, documentNumber, companyName, shippingAddress, shippingDistrict, shippingReference } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { name, lastName, phone, documentType, documentNumber, companyName, shippingAddress, shippingDistrict, shippingReference } as any,
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
      } as any,
    });

    const userWithArrayPermissions = {
      ...user,
      permissions: (user as any).permissions ? (user as any).permissions.split(',').map((p: string) => p.trim()) : []
    };

    res.json({ user: userWithArrayPermissions, message: 'Perfil actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar perfil', error });
  }
};

export const updatePassword = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) return res.status(401).json({ message: 'Contraseña actual incorrecta' });

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id: userId }, data: { password: hashed } });

    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al cambiar contraseña', error });
  }
};
