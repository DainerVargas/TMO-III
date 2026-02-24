import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { logAudit } from '../utils/logger';
import { triggerWebhook } from '../utils/webhooks';

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
