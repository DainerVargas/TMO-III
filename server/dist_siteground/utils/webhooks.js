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
exports.triggerWebhook = void 0;
const axios_1 = __importDefault(require("axios"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const triggerWebhook = (action, entity, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const webhookSetting = yield prisma.globalsettings.findUnique({
            where: { key: 'N8N_WEBHOOK_URL' }
        });
        if (webhookSetting && webhookSetting.value) {
            yield axios_1.default.post(webhookSetting.value, {
                timestamp: new Date().toISOString(),
                action,
                entity,
                data
            });
            console.log(`Webhook triggered: ${action} on ${entity}`);
        }
    }
    catch (error) {
        console.error('Failed to trigger webhook:', error);
    }
});
exports.triggerWebhook = triggerWebhook;
