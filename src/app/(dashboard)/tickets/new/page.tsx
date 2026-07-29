"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft } from "lucide-react";

interface Client { id: string; name: string }

export default function NewTicketPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [form, setForm] = useState({ title: "", description: "", priority: "medium", clientId: "" });

  useEffect(() => {
    fetch("/api/clients").then((r) => r.json()).then(setClients);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) router.push("/tickets");
  }

  return (
    <div className="max-w-2xl">
      <button onClick={() => router.push("/tickets")} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </button>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Novo Atendimento</h1>
      <form onSubmit={handleSubmit} className="card p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Cliente *</label>
          <select value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })} className="input" required>
            <option value="">Selecione...</option>
            {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Título *</label>
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
        <div className="flex gap-3 pt-2">
          <button type="submit" className="btn-primary"><Save className="w-4 h-4" /> Salvar</button>
          <button type="button" onClick={() => router.push("/tickets")} className="btn-secondary">Cancelar</button>
        </div>
      </form>
    </div>
  );
}
