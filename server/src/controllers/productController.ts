import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { logAudit } from '../utils/logger';
import { triggerWebhook } from '../utils/webhooks';

const prisma = new PrismaClient();

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    console.log('Fetching all active products...');
    const products = await prisma.product.findMany({
      include: { category: true },
      where: { isActive: true },
      orderBy: { id: 'desc' } // Changed from createdAt to id to test if createdAt has issues
    });
    console.log(`Successfully fetched ${products.length} products`);
    res.json(products);
  } catch (error: any) {
    console.error('CRITICAL: Error in getAllProducts:', error);
    res.status(500).json({ 
      message: 'Error fetching products', 
      error: error.message,
      code: error.code,
      meta: error.meta
    });
  }
};

export const getAdminProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: [
        { isActive: 'desc' },
        { id: 'desc' }
      ]
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admin products', error });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    // Strip out fields that shouldn't be in the creation data
    const { id, category, stockMovements, orderItems, ...data } = req.body;
    
    const product = await prisma.product.create({
      data: data,
      include: { category: true }
    });
    await logAudit(userId, 'CREATE', 'Product', product.id.toString(), null, product);
    await triggerWebhook('CREATE', 'Product', product);
    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Error creating product', error });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    const productId = parseInt(id as string);
    
    // Strip out fields that shouldn't be in the update data
    const { id: bodyId, category, stockMovements, orderItems, createdAt, updatedAt, ...updateData } = req.body;

    const oldProduct = await prisma.product.findUnique({ where: { id: productId } });
    if (!oldProduct) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data: updateData,
      include: { category: true }
    });
    await logAudit(userId, 'UPDATE', 'Product', productId.toString(), oldProduct, product);
    await triggerWebhook('UPDATE', 'Product', product);
    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Error updating product', error });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    const productId = parseInt(id as string);

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { orderItems: true }
    });

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // If product has been ordered, we only do a soft delete to keep history
    if (product.orderItems.length > 0) {
      await prisma.product.update({
        where: { id: productId },
        data: { isActive: false }
      });
      await logAudit(userId, 'DELETE_SOFT', 'Product', productId.toString(), product, { isActive: false });
      return res.json({ message: 'Producto desactivado (tiene historial de pedidos)' });
    }

    // Otherwise, we can do a hard delete
    // First delete related stock movements
    await prisma.stockMovement.deleteMany({
      where: { productId }
    });

    // Then delete the product
    await prisma.product.delete({
      where: { id: productId }
    });

    await logAudit(userId, 'DELETE_HARD', 'Product', productId.toString(), product, null);
    await triggerWebhook('DELETE', 'Product', { id: productId, deleted: true });
    
    res.json({ message: 'Producto eliminado permanentemente' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Error al eliminar producto', error });
  }
};

export const updateStock = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    const productId = parseInt(id as string);
    const { quantity, type, reason } = req.body; // quantity can be positive or negative

    const currentProduct = await prisma.product.findUnique({ where: { id: productId } });
    if (!currentProduct) return res.status(404).json({ message: 'Producto no encontrado' });

    const newStock = Math.max(0, currentProduct.stock + quantity);
    let stockStatus = 'in-stock';
    if (newStock === 0) stockStatus = 'out-of-stock';
    else if (newStock <= 10) stockStatus = 'low-stock';

    const [updatedProduct] = await prisma.$transaction([
      prisma.product.update({
        where: { id: productId },
        data: { stock: newStock, stockStatus }
      }),
      prisma.stockMovement.create({
        data: {
          productId,
          quantity,
          type,
          reason
        }
      })
    ]);

    await logAudit(userId, 'UPDATE_STOCK', 'Product', productId.toString(), 
      { stock: currentProduct.stock }, 
      { stock: newStock, type, reason }
    );
    await triggerWebhook('UPDATE_STOCK', 'Product', { id: productId, stock: newStock });

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error updating stock', error });
  }
};

export const getStockMovements = async (req: Request, res: Response) => {
  try {
    const movements = await prisma.stockMovement.findMany({
      include: { product: { select: { name: true, sku: true } } },
      orderBy: { createdAt: 'desc' },
      take: 100
    });
    res.json(movements);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stock movements', error });
  }
};

export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!(req as any).file) {
      return res.status(400).json({ message: 'No se subió ninguna imagen' });
    }
    const imageUrl = `/uploads/${(req as any).file.filename}`;
    res.json({ imageUrl });
  } catch (error) {
    res.status(500).json({ message: 'Error al subir imagen', error });
  }
};
