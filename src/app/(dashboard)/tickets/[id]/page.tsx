"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { formatDate, formatCurrency, statusColor, statusLabel } from "@/lib/utils";

interface TicketFull {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  createdAt: string;
  client: { id: string; name: string; email: string };
  user: { name: string } | null;
  budget: {
    id: string;
    total: number;
    status: string;
    items: string;
    createdAt: string;
  } | null;
  workRecords: {
    id: string;
    description: string;
    startDate: string;
    endDate: string | null;
    hoursSpent: number | null;
    createdAt: string;
  }[];
}

export default function TicketDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [ticket, setTicket] = useState<TicketFull | null>(null);

  useEffect(() => {
    fetch(`/api/tickets/${params.id}`)
      .then((r) => r.json())
      .then(setTicket);
  }, [params.id]);

  if (!ticket) return <p>Carregando...</p>;

  async function updateStatus(status: string) {
    await fetch(`/api/tickets/${ticket.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setTicket({ ...ticket, status });
  }

  async function deleteTicket() {
    if (!confirm("Excluir atendimento?")) return;
    await fetch(`/api/tickets/${ticket.id}`, { method: "DELETE" });
    router.push("/tickets");
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{ticket.title}</h1>
        <div className="flex gap-2">
          <button
            onClick={() => router.push("/tickets")}
            className="border px-3 py-1.5 rounded-lg text-sm hover:bg-gray-50"
          >
            Voltar
          </button>
          <button
            onClick={deleteTicket}
            className="border border-red-300 text-red-600 px-3 py-1.5 rounded-lg text-sm hover:bg-red-50"
          >
            Excluir
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="font-semibold mb-3">Detalhes</h2>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-500">Cliente:</span>{" "}
                <Link href={`/clients/${ticket.client.id}`} className="text-blue-600 hover:underline">
                  {ticket.client.name}
                </Link>
              </p>
              <p><span className="text-gray-500">Email:</span> {ticket.client.email}</p>
              {ticket.description && (
                <p><span className="text-gray-500">Descrição:</span><br/>{ticket.description}</p>
              )}
              <p><span className="text-gray-500">Responsável:</span> {ticket.user?.name ?? "-"}</p>
              <p><span className="text-gray-500">Data:</span> {formatDate(ticket.createdAt)}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="font-semibold mb-3">Trabalhos Realizados</h2>
            {ticket.workRecords.length === 0 ? (
              <p className="text-gray-400 text-sm">Nenhum trabalho registrado</p>
            ) : (
              <div className="space-y-3">
                {ticket.workRecords.map((wr) => (
                  <div key={wr.id} className="border rounded-lg p-3">
                    <p className="font-medium">{wr.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(wr.startDate)}
                      {wr.hoursSpent && ` • ${wr.hoursSpent}h`}
                    </p>
                  </div>
                ))}
              </div>
            )}
            <Link
              href={`/work-records/new?ticketId=${ticket.id}`}
              className="inline-block mt-3 text-sm text-blue-600 hover:underline"
            >
              + Adicionar trabalho
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="font-semibold mb-3">Ações</h2>
            <div className="space-y-2">
              {["open", "in_progress", "closed"].map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(s)}
                  disabled={ticket.status === s}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm border ${
                    ticket.status === s
                      ? "bg-blue-50 border-blue-300 text-blue-700"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {statusLabel(s)}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="font-semibold mb-3">
              <span className={`inline-block w-2 h-2 rounded-full mr-2 ${statusColor(ticket.status).split(" ")[0]}`} />
              {statusLabel(ticket.status)}
            </h2>
            <p className="text-xs text-gray-500">Prioridade: {ticket.priority}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="font-semibold mb-3">Orçamento</h2>
            {ticket.budget ? (
              <div>
                <p className="text-lg font-bold">{formatCurrency(ticket.budget.total)}</p>
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(ticket.budget.status)}`}>
                  {statusLabel(ticket.budget.status)}
                </span>
                <Link
                  href={`/budgets/${ticket.budget.id}`}
                  className="block mt-2 text-sm text-blue-600 hover:underline"
                >
                  Ver orçamento
                </Link>
              </div>
            ) : (
              <div>
                <p className="text-gray-400 text-sm mb-2">Nenhum orçamento</p>
                <Link
                  href={`/budgets/new?ticketId=${ticket.id}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  + Criar orçamento
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
