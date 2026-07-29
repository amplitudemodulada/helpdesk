import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const record = await prisma.workRecord.findUnique({
    where: { id: params.id },
    include: { ticket: { include: { client: true } } },
  });

  if (!record) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(record);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const data: Record<string, unknown> = {};

  if (body.description) data.description = body.description;
  if (body.startDate) data.startDate = new Date(body.startDate);
  if (body.endDate) data.endDate = body.endDate ? new Date(body.endDate) : null;
  if (body.hoursSpent !== undefined) data.hoursSpent = Number(body.hoursSpent);

  const record = await prisma.workRecord.update({
    where: { id: params.id },
    data,
  });

  return NextResponse.json(record);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.workRecord.delete({ where: { id: params.id } });

  return NextResponse.json({ success: true });
}
