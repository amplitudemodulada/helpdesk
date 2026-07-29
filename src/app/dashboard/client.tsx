"use client";

import Link from "next/link";
import { Users, Ticket, Receipt, Wrench, ArrowRight } from "lucide-react";

const cards = [
  {
    href: "/clients",
    label: "Clientes",
    icon: Users,
    countKey: "clientsCount" as const,
    color: "from-blue-500 to-blue-600",
    light: "bg-blue-50 text-blue-600",
  },
  {
    href: "/tickets",
    label: "Atendimentos",
    icon: Ticket,
    countKey: "ticketsCount" as const,
    color: "from-violet-500 to-violet-600",
    light: "bg-violet-50 text-violet-600",
  },
  {
    href: "/budgets",
    label: "Orçamentos",
    icon: Receipt,
    countKey: "budgetsCount" as const,
    color: "from-emerald-500 to-emerald-600",
    light: "bg-emerald-50 text-emerald-600",
  },
  {
    href: "/work-records",
    label: "Trabalhos",
    icon: Wrench,
    countKey: "workRecordsCount" as const,
    color: "from-amber-500 to-amber-600",
    light: "bg-amber-50 text-amber-600",
  },
];

export function DashboardClient(props: {
  clientsCount: number;
  ticketsCount: number;
  budgetsCount: number;
  workRecordsCount: number;
}) {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Visão geral do sistema</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="group bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className={`w-12 h-12 rounded-xl ${card.light} flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">
                {props[card.countKey]}
              </div>
              <div className="text-sm text-slate-500">{card.label}</div>
              <div className="flex items-center gap-1 mt-3 text-xs font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                Ver todos <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
