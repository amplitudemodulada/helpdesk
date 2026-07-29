import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const records = await prisma.workRecord.findMany({
    include: { ticket: { include: { client: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(records);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const record = await prisma.workRecord.create({
    data: {
      ticketId: body.ticketId,
      description: body.description,
      startDate: new Date(body.startDate),
      endDate: body.endDate ? new Date(body.endDate) : null,
      hoursSpent: body.hoursSpent ? Number(body.hoursSpent) : null,
    },
    include: { ticket: true },
  });

  return NextResponse.json(record, { status: 201 });
}
