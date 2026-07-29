"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Receipt } from "lucide-react";
import { formatDate, formatCurrency, statusColor, statusLabel } from "@/lib/utils";

interface Budget {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  ticket: { id: string; title: string; client: { name: string } };
}

const filters = ["", "pending", "sent", "approved", "rejected"];

export default function BudgetsPage() {
  const router = useRouter();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetch("/api/budgets")
      .then((r) => r.json())
      .then(setBudgets);
  }, []);

  const filtered = filter ? budgets.filter((b) => b.status === filter) : budgets;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Orçamentos</h1>
          <p className="text-sm text-slate-500 mt-1">{filtered.length} registro(s)</p>
        </div>
        <Link href="/budgets/new" className="btn-primary">
          <Plus className="w-4 h-4" />
          Novo Orçamento
        </Link>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {filters.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`badge border cursor-pointer transition-colors ${
              filter === s
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {s ? statusLabel(s) : "Todos"}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Ticket</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Cliente</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Valor</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((budget) => (
              <tr
                key={budget.id}
                className="hover:bg-slate-50 cursor-pointer transition-colors"
                onClick={() => router.push(`/budgets/${budget.id}`)}
              >
                <td className="px-4 py-3.5 text-sm text-slate-900">{budget.ticket.title}</td>
                <td className="px-4 py-3.5 text-sm text-slate-500">{budget.ticket.client.name}</td>
                <td className="px-4 py-3.5 text-sm font-semibold text-slate-900">{formatCurrency(budget.total)}</td>
                <td className="px-4 py-3.5">
                  <span className={`badge ${statusColor(budget.status)}`}>{statusLabel(budget.status)}</span>
                </td>
                <td className="px-4 py-3.5 text-sm text-slate-400">{formatDate(budget.createdAt)}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center">
                  <Receipt className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">Nenhum orçamento encontrado</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
