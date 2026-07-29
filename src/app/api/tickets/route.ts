import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendTicketNotification } from "@/lib/email";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const tickets = await prisma.ticket.findMany({
    include: { client: true, user: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(tickets);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const ticket = await prisma.ticket.create({
    data: {
      title: body.title,
      description: body.description,
      priority: body.priority ?? "medium",
      clientId: body.clientId,
      userId: (session.user as { id: string }).id,
    },
    include: { client: true },
  });

  try {
    await sendTicketNotification({
      id: ticket.id,
      title: ticket.title,
      clientName: ticket.client.name,
      clientEmail: ticket.client.email,
    });
  } catch {}

  return NextResponse.json(ticket, { status: 201 });
}
