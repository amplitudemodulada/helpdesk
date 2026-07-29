"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDate, formatCurrency, statusColor, statusLabel } from "@/lib/utils";

interface Budget {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  ticket: { id: string; title: string; client: { name: string } };
}

export default function BudgetsPage() {
  const router = useRouter();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetch("/api/budgets")
      .then((r) => r.json())
      .then(setBudgets);
  }, []);

  const filtered = filter
    ? budgets.filter((b) => b.status === filter)
    : budgets;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Orçamentos</h1>
        <Link
          href="/budgets/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Novo Orçamento
        </Link>
      </div>

      <div className="flex gap-2 mb-4">
        {["", "pending", "sent", "approved", "rejected"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1 rounded-full text-sm border ${
              filter === s ? "bg-blue-600 text-white" : "hover:bg-gray-50"
            }`}
          >
            {s ? statusLabel(s) : "Todos"}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium text-sm">Ticket</th>
              <th className="px-4 py-3 font-medium text-sm">Cliente</th>
              <th className="px-4 py-3 font-medium text-sm">Valor</th>
              <th className="px-4 py-3 font-medium text-sm">Status</th>
              <th className="px-4 py-3 font-medium text-sm">Data</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((budget) => (
              <tr
                key={budget.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => router.push(`/budgets/${budget.id}`)}
              >
                <td className="px-4 py-3">{budget.ticket.title}</td>
                <td className="px-4 py-3 text-gray-500">{budget.ticket.client.name}</td>
                <td className="px-4 py-3 font-medium">{formatCurrency(budget.total)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(budget.status)}`}
                  >
                    {statusLabel(budget.status)}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">{formatDate(budget.createdAt)}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  Nenhum orçamento encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
