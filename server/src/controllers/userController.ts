import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { logAudit } from '../utils/logger';
import { triggerWebhook } from '../utils/webhooks';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
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
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const adminId = (req as any).userId;
    const { id } = req.params;
    const userId = typeof id === 'string' ? parseInt(id) : parseInt(id[0]);
    const { role } = req.body;

    const oldUser = await prisma.user.findUnique({ where: { id: userId } });
    const user = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, email: true, name: true, role: true }
    });
    
    await logAudit(adminId, 'UPDATE_ROLE', 'User', userId.toString(), 
      { role: oldUser?.role }, 
      { role: user.role }
    );
    await triggerWebhook('UPDATE_ROLE', 'User', { id: userId, role: user.role });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user role', error });
  }
};

export const toggleUserStatus = async (req: Request, res: Response) => {
  try {
    const adminId = (req as any).userId;
    const { id } = req.params;
    const userId = typeof id === 'string' ? parseInt(id) : parseInt(id[0]);
    const { isActive } = req.body;

    const oldUser = await prisma.user.findUnique({ where: { id: userId } });
    const user = await prisma.user.update({
      where: { id: userId },
      data: { isActive },
      select: { id: true, email: true, name: true, isActive: true }
    });

    await logAudit(adminId, 'TOGGLE_STATUS', 'User', userId.toString(), 
      { isActive: oldUser?.isActive }, 
      { isActive: user.isActive }
    );
    await triggerWebhook('TOGGLE_STATUS', 'User', { id: userId, isActive: user.isActive });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user status', error });
  }
};
export const updateUserPermissions = async (req: Request, res: Response) => {
  try {
    const adminId = (req as any).userId;
    const { id } = req.params;
    const userId = typeof id === 'string' ? parseInt(id) : parseInt(id[0]);
    const { permissions } = req.body; // Expecting string array

    const permissionsString = Array.isArray(permissions) ? permissions.join(',') : permissions;

    const oldUser = await prisma.user.findUnique({ where: { id: userId } });
    const user = await prisma.user.update({
      where: { id: userId },
      data: { permissions: permissionsString },
      select: { id: true, email: true, name: true, permissions: true }
    });
    
    await logAudit(adminId, 'UPDATE_PERMISSIONS', 'User', userId.toString(), 
      { permissions: oldUser?.permissions }, 
      { permissions: user.permissions }
    );

    res.json({
      ...user,
      permissions: user.permissions ? user.permissions.split(',').map((p: string) => p.trim()) : []
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user permissions', error });
  }
};
export const createUser = async (req: Request, res: Response) => {
  try {
    const adminId = (req as any).userId;
    const { email, password, name, lastName, role, phone, documentType, documentNumber, companyName, permissions } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const permissionsString = Array.isArray(permissions) ? permissions.join(',') : permissions;

    const user = await prisma.user.create({
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

    await logAudit(adminId, 'CREATE', 'User', user.id.toString(), null, { email, role, name });
    res.status(201).json({ id: user.id, email: user.email, name: user.name });
  } catch (error: any) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Error al crear usuario', error: error.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const adminId = (req as any).userId;
    const { id } = req.params;
    const userId = typeof id === 'string' ? parseInt(id) : parseInt(id[0]);
    const { email, name, lastName, phone, documentType, documentNumber, companyName, password } = req.body;

    const oldUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!oldUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const data: any = {
      email,
      name,
      lastName,
      phone,
      documentType,
      documentNumber,
      companyName
    };

    if (password && password.trim() !== '') {
      data.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data
    });

    await logAudit(adminId, 'UPDATE', 'User', userId.toString(), oldUser, user);
    res.json({ id: user.id, email: user.email, name: user.name });
  } catch (error: any) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Error al actualizar usuario', error: error.message });
  }
};
