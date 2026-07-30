import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const now = new Date();
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  const [tickets, budgets, clients, statusCounts] = await Promise.all([
    prisma.ticket.findMany({
      where: { createdAt: { gte: twelveMonthsAgo } },
      select: { createdAt: true, priority: true },
    }),
    prisma.budget.findMany({
      where: { status: "approved" },
      select: { total: true, approvedAt: true },
    }),
    prisma.client.findMany({
      select: { id: true, name: true, _count: { select: { tickets: true } } },
      orderBy: { tickets: { _count: "desc" } },
      take: 10,
    }),
    prisma.ticket.groupBy({
      by: ["status"],
      _count: true,
    }),
  ]);

  const monthLabels: string[] = [];
  const ticketsByMonth: number[] = [];
  const revenueByMonth: number[] = [];

  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    monthLabels.push(d.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" }));
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    ticketsByMonth.push(tickets.filter((t) => t.createdAt >= d && t.createdAt < end).length);
    revenueByMonth.push(
      budgets
        .filter((b) => b.approvedAt && b.approvedAt >= d && b.approvedAt < end)
        .reduce((sum, b) => sum + b.total, 0)
    );
  }

  const totalRevenue = budgets.reduce((sum, b) => sum + b.total, 0);
  const totalTickets = await prisma.ticket.count();
  const openTickets = statusCounts.find((s) => s.status === "open")?._count ?? 0;
  const approvalRate = totalTickets > 0 ? Math.round(((statusCounts.find((s) => s.status === "closed")?._count ?? 0) / totalTickets) * 100) : 0;

  const statusDistribution = statusCounts.map((s) => ({
    name: s.status === "open" ? "Aberto" : s.status === "in_progress" ? "Em Andamento" : s.status === "closed" ? "Fechado" : s.status,
    value: s._count,
  }));

  const priorityCounts = await prisma.ticket.groupBy({
    by: ["priority"],
    _count: true,
  });

  const clientRanking = clients.map((c) => ({
    name: c.name,
    tickets: c._count.tickets,
  }));

  return NextResponse.json({
    monthLabels,
    ticketsByMonth,
    revenueByMonth,
    totalRevenue,
    totalTickets,
    openTickets,
    approvalRate,
    statusDistribution,
    priorityCounts: priorityCounts.map((p) => ({ name: p.priority, value: p._count })),
    clientRanking,
  });
}
