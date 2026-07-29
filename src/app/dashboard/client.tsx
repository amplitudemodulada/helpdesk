"use client";

import Link from "next/link";

const cards = [
  { href: "/clients", label: "Clientes", icon: "👥", countKey: "clientsCount" as const },
  { href: "/tickets", label: "Atendimentos", icon: "🎫", countKey: "ticketsCount" as const },
  { href: "/budgets", label: "Orçamentos", icon: "💰", countKey: "budgetsCount" as const },
  { href: "/work-records", label: "Trabalhos", icon: "🔧", countKey: "workRecordsCount" as const },
];

export function DashboardClient(props: {
  clientsCount: number;
  ticketsCount: number;
  budgetsCount: number;
  workRecordsCount: number;
}) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
          >
            <div className="text-3xl mb-2">{card.icon}</div>
            <div className="text-3xl font-bold mb-1">
              {props[card.countKey]}
            </div>
            <div className="text-gray-500">{card.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
