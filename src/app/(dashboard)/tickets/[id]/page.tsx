"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trash2, Edit3, Save, X, ExternalLink, Clock, User, Mail, Tag } from "lucide-react";
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
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", priority: "medium" });

  useEffect(() => {
    fetch(`/api/tickets/${params.id}`)
      .then((r) => r.json())
      .then((data: TicketFull) => {
        setTicket(data);
        setForm({ title: data.title, description: data.description ?? "", priority: data.priority });
      });
  }, [params.id]);

  if (!ticket) return <p>Carregando...</p>;

  async function updateStatus(status: string) {
    if (!ticket) return;
    await fetch(`/api/tickets/${ticket.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setTicket({ ...ticket, status });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!ticket) return;
    await fetch(`/api/tickets/${ticket.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setTicket({ ...ticket, ...form });
    setEditing(false);
  }

  async function deleteTicket() {
    if (!ticket) return;
    if (!confirm("Excluir atendimento?")) return;
    await fetch(`/api/tickets/${ticket.id}`, { method: "DELETE" });
    router.push("/tickets");
  }

  return (
    <div>
      <button onClick={() => router.push("/tickets")} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Voltar para Atendimentos
      </button>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">{ticket.title}</h1>
        <div className="flex gap-2">
          <button onClick={() => setEditing(!editing)} className="btn-secondary">
            {editing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
            {editing ? "Cancelar" : "Editar"}
          </button>
          <button onClick={deleteTicket} className="btn-danger"><Trash2 className="w-4 h-4" /> Excluir</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {editing ? (
            <form onSubmit={handleSave} className="card p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Título</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input" rows={4} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Prioridade</label>
                <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="input">
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                  <option value="urgent">Urgente</option>
                </select>
              </div>
              <button type="submit" className="btn-primary"><Save className="w-4 h-4" /> Salvar</button>
            </form>
          ) : (
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center"><Tag className="w-5 h-5 text-blue-600" /></div>
                <h2 className="text-lg font-semibold text-slate-900">Detalhes</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-slate-600"><User className="w-4 h-4 text-slate-400" /> {ticket.client.name}</div>
                <div className="flex items-center gap-2 text-slate-600"><Mail className="w-4 h-4 text-slate-400" /> {ticket.client.email}</div>
                <div className="flex items-center gap-2 text-slate-600"><Clock className="w-4 h-4 text-slate-400" /> {formatDate(ticket.createdAt)}</div>
                <div className="flex items-center gap-2 text-slate-600"><User className="w-4 h-4 text-slate-400" /> Resp: {ticket.user?.name ?? "-"}</div>
              </div>
              {ticket.description && (
                <div className="mt-4 p-3 bg-slate-50 rounded-lg text-sm text-slate-700">{ticket.description}</div>
              )}
              <Link href={`/clients/${ticket.client.id}`} className="inline-flex items-center gap-1 mt-3 text-sm text-blue-600 hover:underline">
                <ExternalLink className="w-3.5 h-3.5" /> Ver cliente
              </Link>
            </div>
          )}

          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center"><Clock className="w-5 h-5 text-amber-600" /></div>
              <h2 className="text-lg font-semibold text-slate-900">Trabalhos Realizados</h2>
            </div>
            {ticket.workRecords.length === 0 ? (
              <p className="text-slate-400 text-sm">Nenhum trabalho registrado</p>
            ) : (
              <div className="space-y-2">
                {ticket.workRecords.map((wr) => (
                  <div key={wr.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{wr.description}</p>
                      <p className="text-xs text-slate-500">{formatDate(wr.startDate)}{wr.hoursSpent && ` • ${wr.hoursSpent}h`}</p>
                    </div>
                    <Link href={`/work-records/${wr.id}`} className="text-blue-600 hover:text-blue-800"><ExternalLink className="w-4 h-4" /></Link>
                  </div>
                ))}
              </div>
            )}
            <Link href={`/work-records/new?ticketId=${ticket.id}`} className="inline-flex items-center gap-1 mt-3 text-sm text-blue-600 hover:underline">
              + Adicionar trabalho
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="font-semibold text-slate-900 mb-3">Ações</h2>
            <div className="space-y-2">
              {[["open", "Abrir"], ["in_progress", "Em Andamento"], ["closed", "Fechar"]].map(([s, label]) => (
                <button key={s} onClick={() => updateStatus(s)} disabled={ticket.status === s} className={`w-full text-left px-3 py-2 rounded-lg text-sm border transition-all ${
                  ticket.status === s ? "bg-blue-50 border-blue-300 text-blue-700 font-medium" : "hover:bg-slate-50 text-slate-600"
                }`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h2 className="font-semibold text-slate-900 mb-3">Status</h2>
            <div className="flex items-center gap-2">
              <span className={`badge ${statusColor(ticket.status)}`}>{statusLabel(ticket.status)}</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Prioridade: {ticket.priority}</p>
          </div>

          <div className="card p-6">
            <h2 className="font-semibold text-slate-900 mb-3">Orçamento</h2>
            {ticket.budget ? (
              <div>
                <p className="text-lg font-bold text-slate-900">{formatCurrency(ticket.budget.total)}</p>
                <span className={`badge mt-1 ${statusColor(ticket.budget.status)}`}>{statusLabel(ticket.budget.status)}</span>
                <Link href={`/budgets/${ticket.budget.id}`} className="flex items-center gap-1 mt-2 text-sm text-blue-600 hover:underline">
                  <ExternalLink className="w-3.5 h-3.5" /> Ver orçamento
                </Link>
              </div>
            ) : (
              <div>
                <p className="text-slate-400 text-sm mb-2">Nenhum orçamento</p>
                <Link href={`/budgets/new?ticketId=${ticket.id}`} className="text-sm text-blue-600 hover:underline">+ Criar orçamento</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
