"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDate, statusColor, statusLabel } from "@/lib/utils";

interface Ticket {
  id: string;
  title: string;
  status: string;
  priority: string;
  createdAt: string;
  client: { name: string };
}

export default function TicketsPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetch("/api/tickets")
      .then((r) => r.json())
      .then(setTickets);
  }, []);

  const filtered = filter
    ? tickets.filter((t) => t.status === filter)
    : tickets;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Atendimentos</h1>
        <Link
          href="/tickets/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Novo Atendimento
        </Link>
      </div>

      <div className="flex gap-2 mb-4">
        {["", "open", "in_progress", "closed"].map((s) => (
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
              <th className="px-4 py-3 font-medium text-sm">Título</th>
              <th className="px-4 py-3 font-medium text-sm">Cliente</th>
              <th className="px-4 py-3 font-medium text-sm">Status</th>
              <th className="px-4 py-3 font-medium text-sm">Prioridade</th>
              <th className="px-4 py-3 font-medium text-sm">Data</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((ticket) => (
              <tr
                key={ticket.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => router.push(`/tickets/${ticket.id}`)}
              >
                <td className="px-4 py-3 font-medium">{ticket.title}</td>
                <td className="px-4 py-3 text-gray-500">{ticket.client.name}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(ticket.status)}`}
                  >
                    {statusLabel(ticket.status)}
                  </span>
                </td>
                <td className="px-4 py-3">{ticket.priority}</td>
                <td className="px-4 py-3 text-gray-500">{formatDate(ticket.createdAt)}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  Nenhum atendimento encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
