"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Ticket } from "lucide-react";
import { formatDate, statusColor, statusLabel } from "@/lib/utils";

interface TicketItem {
  id: string;
  title: string;
  status: string;
  priority: string;
  createdAt: string;
  client: { name: string };
}

const filters = ["", "open", "in_progress", "closed"];

export default function TicketsPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetch("/api/tickets")
      .then((r) => r.json())
      .then(setTickets);
  }, []);

  const filtered = filter ? tickets.filter((t) => t.status === filter) : tickets;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Atendimentos</h1>
          <p className="text-sm text-slate-500 mt-1">{filtered.length} registro(s)</p>
        </div>
        <Link href="/tickets/new" className="btn-primary">
          <Plus className="w-4 h-4" />
          Novo Atendimento
        </Link>
      </div>

      <div className="flex gap-2 mb-4">
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
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Título</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Cliente</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Prioridade</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((ticket) => (
              <tr
                key={ticket.id}
                className="hover:bg-slate-50 cursor-pointer transition-colors"
                onClick={() => router.push(`/tickets/${ticket.id}`)}
              >
                <td className="px-4 py-3.5 text-sm font-medium text-slate-900">{ticket.title}</td>
                <td className="px-4 py-3.5 text-sm text-slate-500">{ticket.client.name}</td>
                <td className="px-4 py-3.5">
                  <span className={`badge ${statusColor(ticket.status)}`}>{statusLabel(ticket.status)}</span>
                </td>
                <td className="px-4 py-3.5 text-sm text-slate-500 capitalize">{ticket.priority}</td>
                <td className="px-4 py-3.5 text-sm text-slate-400">{formatDate(ticket.createdAt)}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center">
                  <Ticket className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">Nenhum atendimento encontrado</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
