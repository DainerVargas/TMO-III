import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const triggerWebhook = async (action: string, entity: string, data: any) => {
  try {
    const webhookSetting = await prisma.globalsettings.findUnique({
      where: { key: 'N8N_WEBHOOK_URL' }
    });

    if (webhookSetting && webhookSetting.value) {
      await axios.post(webhookSetting.value, {
        timestamp: new Date().toISOString(),
        action,
        entity,
        data
      });
      console.log(`Webhook triggered: ${action} on ${entity}`);
    }
  } catch (error) {
    console.error('Failed to trigger webhook:', error);
  }
};
