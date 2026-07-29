import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const budget = await prisma.budget.findUnique({
    where: { id: params.id },
    include: { ticket: { include: { client: true } } },
  });

  if (!budget) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(budget);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const data: Record<string, unknown> = {};

  if (body.items) data.items = JSON.stringify(body.items);
  if (body.total !== undefined) data.total = body.total;
  if (body.status) data.status = body.status;
  if (body.status === "approved") data.approvedAt = new Date();
  if (body.status === "sent") data.sentAt = new Date();

  const budget = await prisma.budget.update({
    where: { id: params.id },
    data,
  });

  return NextResponse.json(budget);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.budget.delete({ where: { id: params.id } });

  return NextResponse.json({ success: true });
}
