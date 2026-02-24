import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { logAudit } from '../utils/logger';
import { triggerWebhook } from '../utils/webhooks';

const prisma = new PrismaClient();

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { userId, total, items } = req.body;

    const order = await prisma.order.create({
      data: {
        userId,
        total,
        status: 'PENDING',
        orderItems: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { orderItems: true },
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error });
  }
};

export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
};

export const getAdminOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            name: true,
            lastName: true,
            email: true,
            phone: true,
            documentNumber: true,
            documentType: true,
          },
        },
        orderItems: {
          include: {
            product: {
              select: { name: true, sku: true, unit: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admin orders', error });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const adminId = (req as any).userId;
    const { id } = req.params;
    const orderId = typeof id === 'string' ? id : id[0];
    const { status } = req.body;

    const oldOrder = await prisma.order.findUnique({ where: { id: parseInt(orderId) } });
    const order = await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: { status },
    });

    await logAudit(adminId, 'UPDATE_STATUS', 'Order', orderId, 
      { status: oldOrder?.status }, 
      { status: order.status }
    );
    await triggerWebhook('UPDATE_STATUS', 'Order', order);

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status', error });
  }
};
