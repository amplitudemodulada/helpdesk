import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendBudgetNotification } from "@/lib/email";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const budgets = await prisma.budget.findMany({
    include: { ticket: { include: { client: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(budgets);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const budget = await prisma.budget.create({
    data: {
      ticketId: body.ticketId,
      items: JSON.stringify(body.items),
      total: body.total,
    },
    include: { ticket: { include: { client: true } } },
  });

  try {
    await sendBudgetNotification({
      id: budget.id,
      ticketTitle: budget.ticket.title,
      total: budget.total,
      clientName: budget.ticket.client.name,
      clientEmail: budget.ticket.client.email,
    });
  } catch {}

  return NextResponse.json(budget, { status: 201 });
}
