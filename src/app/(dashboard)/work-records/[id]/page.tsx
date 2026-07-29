"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Edit3, Save, X, Wrench, Clock, Calendar, ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface WorkRecordFull {
  id: string;
  description: string;
  startDate: string;
  endDate: string | null;
  hoursSpent: number | null;
  createdAt: string;
  ticket: { id: string; title: string; client: { name: string } };
}

export default function WorkRecordDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [record, setRecord] = useState<WorkRecordFull | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ description: "", startDate: "", endDate: "", hoursSpent: "" });

  useEffect(() => {
    fetch(`/api/work-records/${params.id}`)
      .then((r) => r.json())
      .then((data: WorkRecordFull) => {
        setRecord(data);
        setForm({
          description: data.description,
          startDate: data.startDate.slice(0, 10),
          endDate: data.endDate ? data.endDate.slice(0, 10) : "",
          hoursSpent: data.hoursSpent?.toString() ?? "",
        });
      });
  }, [params.id]);

  if (!record) return <p>Carregando...</p>;

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!record) return;
    const body: Record<string, unknown> = { description: form.description, startDate: form.startDate };
    if (form.endDate) body.endDate = form.endDate;
    if (form.hoursSpent) body.hoursSpent = Number(form.hoursSpent);

    await fetch(`/api/work-records/${record.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setEditing(false);
    window.location.reload();
  }

  return (
    <div className="max-w-2xl">
      <button onClick={() => router.push("/work-records")} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Voltar para Trabalhos
      </button>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Trabalho Realizado</h1>
        <button onClick={() => setEditing(!editing)} className="btn-secondary">
          {editing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
          {editing ? "Cancelar" : "Editar"}
        </button>
      </div>

      {editing ? (
        <form onSubmit={handleSave} className="card p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input" rows={3} required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Data Início</label>
              <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="input" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Data Fim</label>
              <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Horas</label>
              <input type="number" value={form.hoursSpent} onChange={(e) => setForm({ ...form, hoursSpent: e.target.value })} className="input" min={0} step={0.5} />
            </div>
          </div>
          <button type="submit" className="btn-primary"><Save className="w-4 h-4" /> Salvar</button>
        </form>
      ) : (
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center"><Wrench className="w-5 h-5 text-amber-600" /></div>
            <h2 className="text-lg font-semibold text-slate-900">Detalhes</h2>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-slate-50 rounded-lg text-sm text-slate-700">{record.description}</div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-slate-600"><Calendar className="w-4 h-4 text-slate-400" /> {formatDate(record.startDate)}</div>
              {record.endDate && <div className="flex items-center gap-2 text-slate-600"><Calendar className="w-4 h-4 text-slate-400" /> {formatDate(record.endDate)}</div>}
              {record.hoursSpent && <div className="flex items-center gap-2 text-slate-600"><Clock className="w-4 h-4 text-slate-400" /> {record.hoursSpent}h</div>}
            </div>
            <div className="text-sm text-slate-600">
              <p><span className="text-slate-500">Ticket:</span> {record.ticket.title}</p>
              <p><span className="text-slate-500">Cliente:</span> {record.ticket.client.name}</p>
            </div>
          </div>
          <a href={`/tickets/${record.ticket.id}`} className="inline-flex items-center gap-1 mt-4 text-sm text-blue-600 hover:underline">
            <ExternalLink className="w-3.5 h-3.5" /> Ver ticket
          </a>
        </div>
      )}
    </div>
  );
}
