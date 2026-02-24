import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const logAudit = async (userId: number, action: string, entity: string, entityId: string, oldData?: any, newData?: any) => {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entity,
        entityId: entityId.toString(),
        oldData: oldData ? JSON.stringify(oldData) : null,
        newData: newData ? JSON.stringify(newData) : null,
      }
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
  }
};
