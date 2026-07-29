"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { formatDate, formatCurrency, statusColor, statusLabel } from "@/lib/utils";

interface BudgetFull {
  id: string;
  total: number;
  status: string;
  items: string;
  sentAt: string | null;
  approvedAt: string | null;
  createdAt: string;
  ticket: {
    id: string;
    title: string;
    client: { id: string; name: string; email: string };
  };
}

export default function BudgetDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [budget, setBudget] = useState<BudgetFull | null>(null);

  useEffect(() => {
    fetch(`/api/budgets/${params.id}`)
      .then((r) => r.json())
      .then(setBudget);
  }, [params.id]);

  if (!budget) return <p>Carregando...</p>;

  const items = JSON.parse(budget.items || "[]") as {
    description: string;
    quantity: number;
    unitPrice: number;
  }[];

  async function updateStatus(status: string) {
    await fetch(`/api/budgets/${budget.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBudget({ ...budget, status });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Orçamento</h1>
        <button
          onClick={() => router.push("/budgets")}
          className="border px-3 py-1.5 rounded-lg text-sm hover:bg-gray-50"
        >
          Voltar
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="font-semibold mb-3">Itens</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Descrição</th>
                  <th className="text-right py-2">Qtd</th>
                  <th className="text-right py-2">Valor Unit.</th>
                  <th className="text-right py-2">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={i} className="border-b">
                    <td className="py-2">{item.description}</td>
                    <td className="text-right py-2">{item.quantity}</td>
                    <td className="text-right py-2">{formatCurrency(item.unitPrice)}</td>
                    <td className="text-right py-2">{formatCurrency(item.quantity * item.unitPrice)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="text-right font-bold py-2">Total</td>
                  <td className="text-right font-bold py-2">{formatCurrency(budget.total)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="font-semibold mb-3">Informações</h2>
            <div className="space-y-1 text-sm">
              <p><span className="text-gray-500">Ticket:</span> {budget.ticket.title}</p>
              <p><span className="text-gray-500">Cliente:</span> {budget.ticket.client.name}</p>
              <p><span className="text-gray-500">Email:</span> {budget.ticket.client.email}</p>
              <p><span className="text-gray-500">Criado em:</span> {formatDate(budget.createdAt)}</p>
              {budget.sentAt && <p><span className="text-gray-500">Enviado em:</span> {formatDate(budget.sentAt)}</p>}
              {budget.approvedAt && <p><span className="text-gray-500">Aprovado em:</span> {formatDate(budget.approvedAt)}</p>}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="font-semibold mb-3">Status</h2>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusColor(budget.status)}`}>
              {statusLabel(budget.status)}
            </span>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="font-semibold mb-3">Ações</h2>
            <div className="space-y-2">
              <button
                onClick={() => updateStatus("sent")}
                disabled={budget.status === "sent"}
                className="w-full text-left px-3 py-2 rounded-lg text-sm border hover:bg-gray-50 disabled:bg-blue-50 disabled:border-blue-300 disabled:text-blue-700"
              >
                Enviar
              </button>
              <button
                onClick={() => updateStatus("approved")}
                disabled={budget.status === "approved"}
                className="w-full text-left px-3 py-2 rounded-lg text-sm border hover:bg-gray-50 disabled:bg-green-50 disabled:border-green-300 disabled:text-green-700"
              >
                Aprovar
              </button>
              <button
                onClick={() => updateStatus("rejected")}
                disabled={budget.status === "rejected"}
                className="w-full text-left px-3 py-2 rounded-lg text-sm border hover:bg-gray-50 disabled:bg-red-50 disabled:border-red-300 disabled:text-red-700"
              >
                Recusar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
