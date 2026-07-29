import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const ticket = await prisma.ticket.findUnique({
    where: { id: params.id },
    include: { client: true, user: true, budget: true, workRecords: true },
  });

  if (!ticket) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(ticket);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const ticket = await prisma.ticket.update({
    where: { id: params.id },
    data: body,
  });

  return NextResponse.json(ticket);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.ticket.delete({ where: { id: params.id } });

  return NextResponse.json({ success: true });
}
