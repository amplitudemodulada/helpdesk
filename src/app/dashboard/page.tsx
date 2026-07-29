import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { DashboardClient } from "./client";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const [clientsCount, ticketsCount, budgetsCount, workRecordsCount] =
    await Promise.all([
      prisma.client.count(),
      prisma.ticket.count(),
      prisma.budget.count(),
      prisma.workRecord.count(),
    ]);

  return (
    <DashboardClient
      clientsCount={clientsCount}
      ticketsCount={ticketsCount}
      budgetsCount={budgetsCount}
      workRecordsCount={workRecordsCount}
    />
  );
}
