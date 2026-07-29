"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Edit3, Save, X, Plus, Trash2, Receipt } from "lucide-react";
import { formatDate, formatCurrency, statusColor, statusLabel } from "@/lib/utils";

interface Item { description: string; quantity: number; unitPrice: number }

interface BudgetFull {
  id: string;
  total: number;
  status: string;
  items: string;
  sentAt: string | null;
  approvedAt: string | null;
  createdAt: string;
  ticket: { id: string; title: string; client: { id: string; name: string; email: string } };
}

export default function BudgetDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [budget, setBudget] = useState<BudgetFull | null>(null);
  const [editing, setEditing] = useState(false);
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    fetch(`/api/budgets/${params.id}`)
      .then((r) => r.json())
      .then((data: BudgetFull) => {
        setBudget(data);
        setItems(JSON.parse(data.items || "[]"));
      });
  }, [params.id]);

  if (!budget) return <p>Carregando...</p>;

  const total = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  async function updateStatus(status: string) {
    if (!budget) return;
    await fetch(`/api/budgets/${budget.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBudget({ ...budget, status });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!budget) return;
    await fetch(`/api/budgets/${budget.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items, total }),
    });
    setBudget({ ...budget, items: JSON.stringify(items), total });
    setEditing(false);
  }

  function addItem() { setItems([...items, { description: "", quantity: 1, unitPrice: 0 }]); }
  function removeItem(i: number) { setItems(items.filter((_, idx) => idx !== i)); }
  function updateItem(i: number, field: keyof Item, value: string | number) {
    const next = [...items];
    (next[i] as unknown as Record<string, unknown>)[field] = value;
    setItems(next);
  }

  return (
    <div>
      <button onClick={() => router.push("/budgets")} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Voltar para Orçamentos
      </button>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Orçamento</h1>
        <button onClick={() => setEditing(!editing)} className="btn-secondary">
          {editing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
          {editing ? "Cancelar" : "Editar Itens"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {editing ? (
            <form onSubmit={handleSave} className="card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-slate-900">Itens do Orçamento</h2>
                <button type="button" onClick={addItem} className="btn-secondary text-sm"><Plus className="w-4 h-4" /> Adicionar</button>
              </div>
              {items.map((item, i) => (
                <div key={i} className="flex gap-2 items-start p-3 bg-slate-50 rounded-lg">
                  <div className="flex-1">
                    <input placeholder="Descrição" value={item.description} onChange={(e) => updateItem(i, "description", e.target.value)} className="input text-sm" required />
                  </div>
                  <div className="w-20">
                    <input type="number" placeholder="Qtd" value={item.quantity} onChange={(e) => updateItem(i, "quantity", Number(e.target.value))} className="input text-sm" min={1} required />
                  </div>
                  <div className="w-28">
                    <input type="number" placeholder="Valor" value={item.unitPrice} onChange={(e) => updateItem(i, "unitPrice", Number(e.target.value))} className="input text-sm" min={0} step={0.01} required />
                  </div>
                  <div className="text-sm font-medium text-slate-700 pt-2 w-24 text-right">{formatCurrency(item.quantity * item.unitPrice)}</div>
                  <button type="button" onClick={() => removeItem(i)} className="p-2 text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
              <div className="text-right text-lg font-bold text-slate-900">Total: {formatCurrency(total)}</div>
              <button type="submit" className="btn-primary"><Save className="w-4 h-4" /> Salvar Itens</button>
            </form>
          ) : (
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center"><Receipt className="w-5 h-5 text-violet-600" /></div>
                <h2 className="text-lg font-semibold text-slate-900">Itens</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-2 text-slate-600 font-medium">Descrição</th>
                      <th className="text-right py-2 text-slate-600 font-medium">Qtd</th>
                      <th className="text-right py-2 text-slate-600 font-medium">Valor Unit.</th>
                      <th className="text-right py-2 text-slate-600 font-medium">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, i) => (
                      <tr key={i} className="border-b border-slate-100">
                        <td className="py-2 text-slate-800">{item.description}</td>
                        <td className="text-right py-2 text-slate-600">{item.quantity}</td>
                        <td className="text-right py-2 text-slate-600">{formatCurrency(item.unitPrice)}</td>
                        <td className="text-right py-2 font-medium text-slate-800">{formatCurrency(item.quantity * item.unitPrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3} className="text-right font-bold py-2 text-slate-900">Total</td>
                      <td className="text-right font-bold py-2 text-lg text-slate-900">{formatCurrency(total)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          <div className="card p-6">
            <h2 className="font-semibold text-slate-900 mb-3">Informações</h2>
            <div className="space-y-2 text-sm text-slate-600">
              <p><span className="text-slate-500">Ticket:</span> {budget.ticket.title}</p>
              <p><span className="text-slate-500">Cliente:</span> {budget.ticket.client.name}</p>
              <p><span className="text-slate-500">Email:</span> {budget.ticket.client.email}</p>
              <p><span className="text-slate-500">Criado em:</span> {formatDate(budget.createdAt)}</p>
              {budget.sentAt && <p><span className="text-slate-500">Enviado em:</span> {formatDate(budget.sentAt)}</p>}
              {budget.approvedAt && <p><span className="text-slate-500">Aprovado em:</span> {formatDate(budget.approvedAt)}</p>}
            </div>
            <button onClick={() => router.push(`/tickets/${budget.ticket.id}`)} className="inline-flex items-center gap-1 mt-3 text-sm text-blue-600 hover:underline">
              Ver ticket &rarr;
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="font-semibold text-slate-900 mb-3">Status</h2>
            <span className={`badge ${statusColor(budget.status)}`}>{statusLabel(budget.status)}</span>
          </div>

          <div className="card p-6">
            <h2 className="font-semibold text-slate-900 mb-3">Ações</h2>
            <div className="space-y-2">
              {[["pending", "Pendente"], ["sent", "Enviar"], ["approved", "Aprovar"], ["rejected", "Recusar"]].map(([s, label]) => (
                <button key={s} onClick={() => updateStatus(s)} disabled={budget.status === s} className={`w-full text-left px-3 py-2 rounded-lg text-sm border transition-all ${
                  budget.status === s ? "bg-blue-50 border-blue-300 text-blue-700 font-medium" : "hover:bg-slate-50 text-slate-600"
                }`}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
