import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllSettings = async (req: Request, res: Response) => {
  try {
    const settings = await prisma.globalsettings.findMany();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching settings', error });
  }
};

export const updateSetting = async (req: Request, res: Response) => {
  try {
    const { key, value, description } = req.body;
    const setting = await prisma.globalsettings.upsert({
      where: { key },
      update: { value, description },
      create: { key, value, description }
    });
    res.json(setting);
  } catch (error) {
    res.status(500).json({ message: 'Error updating setting', error });
  }
};

export const getAuditLogs = async (req: Request, res: Response) => {
  try {
    const logs = await prisma.auditlog.findMany({
      include: {
        user: {
          select: { name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching audit logs', error });
  }
};

export const getStats = async (req: Request, res: Response) => {
  try {
    const [
      totalProducts,
      activeProducts,
      totalCategories,
      totalUsers,
      pendingOrders,
      totalOrders,
      lowStockProducts,
      products
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.category.count(),
      prisma.user.count(),
      prisma.order.count({ where: { status: 'pending' } }),
      prisma.order.count(),
      prisma.product.count({ where: { stock: { lte: 10 }, isActive: true } }),
      prisma.product.findMany({ select: { stock: true, price: true, categoryId: true } })
    ]);

    const totalStockValue = products.reduce((acc, p) => acc + (p.stock * p.price.toNumber()), 0);

    // Get sales for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentOrders = await prisma.order.findMany({
      where: {
        createdAt: { gte: sevenDaysAgo },
        status: { not: 'cancelled' }
      },
      select: {
        createdAt: true,
        total: true
      }
    });

    // Group sales by day
    const dayMap: Record<string, { sales: number; orders: number }> = {};
    const days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
    
    // Initialize last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = days[d.getDay()];
      dayMap[label] = { sales: 0, orders: 0 };
    }

    recentOrders.forEach(order => {
      const label = days[order.createdAt.getDay()];
      if (dayMap[label]) {
        dayMap[label].sales += order.total.toNumber();
        dayMap[label].orders += 1;
      }
    });

    const salesHistory = Object.entries(dayMap).map(([name, data]) => ({
      name,
      ...data
    }));

    // Category distribution (simplified)
    const catMap: Record<string, number> = {};
    products.forEach(p => {
      catMap[p.categoryId] = (catMap[p.categoryId] || 0) + 1;
    });

    const topCategories = Object.entries(catMap)
      .map(([id, count]) => ({
        label: id.charAt(0).toUpperCase() + id.slice(1),
        percentage: Math.round((count / totalProducts) * 100),
        color: id === 'oficina' ? 'bg-[#0a4d8c]' : id === 'limpieza' ? 'bg-[#00bcd4]' : 'bg-indigo-500'
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 3);

    res.json({
      totalProducts,
      activeProducts,
      totalCategories,
      totalUsers,
      pendingOrders,
      totalOrders,
      lowStockProducts,
      totalStockValue,
      salesHistory,
      topCategories,
      salesGrowth: "+12.5%", // These could be calculated by comparing with previous period
      orderGrowth: "+8.2%"
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ message: 'Error fetching stats', error });
  }
};
