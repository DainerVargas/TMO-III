import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { logAudit } from '../utils/logger';
import { triggerWebhook } from '../utils/webhooks';

const prisma = new PrismaClient();

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id, name, icon } = req.body;
    
    if (!id || !name) {
      return res.status(400).json({ message: 'El ID y el Nombre son obligatorios' });
    }

    const category = await prisma.category.create({
      data: { id, name, icon: icon || 'Package' }
    });
    
    await logAudit(userId, 'CREATE', 'Category', id, null, category);
    await triggerWebhook('CREATE', 'Category', category);
    res.status(201).json(category);
  } catch (error: any) {
    console.error('CRITICAL Error in createCategory:', error);
    res.status(500).json({ 
      message: 'Error al crear la categoría: ' + (error.code === 'P2002' ? 'El ID ya existe' : error.message),
      error 
    });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    const categoryId = typeof id === 'string' ? id : id[0];
    const { name, icon } = req.body;
    
    const oldCategory = await prisma.category.findUnique({ where: { id: categoryId } });
    const category = await prisma.category.update({
      where: { id: categoryId },
      data: { name, icon }
    });
    await logAudit(userId, 'UPDATE', 'Category', categoryId, oldCategory, category);
    await triggerWebhook('UPDATE', 'Category', category);
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error updating category', error });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    const categoryId = typeof id === 'string' ? id : id[0];
    const oldCategory = await prisma.category.findUnique({ where: { id: categoryId } });
    await prisma.category.delete({
      where: { id: categoryId }
    });
    await logAudit(userId, 'DELETE', 'Category', categoryId, oldCategory, null);
    await triggerWebhook('DELETE', 'Category', { id: categoryId });
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category', error });
  }
};
