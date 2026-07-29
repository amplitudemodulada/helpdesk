import { z } from "zod";

const rateStore = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  key: string,
  maxRequests = 30,
  windowMs = 60000
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateStore.get(key);

  if (!entry || now > entry.resetAt) {
    rateStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  entry.count++;
  if (entry.count > maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  return { allowed: true, remaining: maxRequests - entry.count };
}

export const clientSchema = z.object({
  name: z.string().min(1, "Nome obrigatório").max(200),
  email: z.string().email("Email inválido").max(200),
  phone: z.string().max(50).optional().default(""),
  company: z.string().max(200).optional().default(""),
  notes: z.string().max(2000).optional().default(""),
});

export const ticketSchema = z.object({
  title: z.string().min(1, "Título obrigatório").max(300),
  description: z.string().max(5000).optional().default(""),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  clientId: z.string().min(1, "Cliente obrigatório"),
});

export const budgetSchema = z.object({
  ticketId: z.string().min(1),
  items: z.array(
    z.object({
      description: z.string().min(1),
      quantity: z.number().min(1),
      unitPrice: z.number().min(0),
    })
  ).min(1, "Pelo menos um item é obrigatório"),
  total: z.number().min(0),
});

export const workRecordSchema = z.object({
  ticketId: z.string().min(1),
  description: z.string().min(1, "Descrição obrigatória").max(2000),
  startDate: z.string().min(1),
  endDate: z.string().optional().default(""),
  hoursSpent: z.number().min(0).optional(),
});

export const userSchema = z.object({
  name: z.string().min(1, "Nome obrigatório").max(200),
  email: z.string().email("Email inválido").max(200),
  password: z.string().min(6, "Mínimo 6 caracteres").max(100),
  role: z.enum(["admin", "agent"]).default("agent"),
});

export const userUpdateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  email: z.string().email().max(200).optional(),
  password: z.string().min(6).max(100).optional(),
  role: z.enum(["admin", "agent"]).optional(),
  active: z.boolean().optional(),
});

export function checkDomain(reqHost: string | null): boolean {
  const allowed = process.env.APP_DOMAIN;
  if (!allowed) return true;
  return reqHost === allowed || reqHost?.endsWith(".vercel.app") === true;
}
