"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Users, Building2, Phone, Mail, FileText, ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  notes: string | null;
  createdAt: string;
  tickets: { id: string; title: string; status: string; createdAt: string }[];
}

export default function EditClientPage() {
  const router = useRouter();
  const params = useParams();
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", notes: "" });
  const [tickets, setTickets] = useState<Client["tickets"]>([]);

  useEffect(() => {
    fetch(`/api/clients/${params.id}`)
      .then((r) => r.json())
      .then((data: Client) => {
        setForm({ name: data.name, email: data.email, phone: data.phone ?? "", company: data.company ?? "", notes: data.notes ?? "" });
        setTickets(data.tickets);
      });
  }, [params.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch(`/api/clients/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    router.push("/clients");
  }

  return (
    <div className="max-w-3xl">
      <button onClick={() => router.push("/clients")} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Voltar para Clientes
      </button>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Editar Cliente</h1>

      <form onSubmit={handleSubmit} className="card p-6 space-y-5 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nome *</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1"><Phone className="w-3.5 h-3.5 inline" /> Telefone</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1"><Building2 className="w-3.5 h-3.5 inline" /> Empresa</label>
            <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="input" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1"><FileText className="w-3.5 h-3.5 inline" /> Observações</label>
          <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input" rows={3} />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" className="btn-primary"><Save className="w-4 h-4" /> Salvar</button>
          <button type="button" onClick={() => router.push("/clients")} className="btn-secondary">Cancelar</button>
        </div>
      </form>

      {tickets.length > 0 && (
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center"><Users className="w-5 h-5 text-blue-600" /></div>
            <h2 className="text-lg font-semibold text-slate-900">Atendimentos ({tickets.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 text-slate-600 font-medium">Título</th>
                  <th className="text-left py-2 text-slate-600 font-medium">Status</th>
                  <th className="text-left py-2 text-slate-600 font-medium">Data</th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tickets.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 text-slate-800">{t.title}</td>
                    <td className="py-2.5">
                      <span className="badge bg-blue-100 text-blue-800">{t.status === "open" ? "Aberto" : t.status === "in_progress" ? "Em Andamento" : t.status === "closed" ? "Fechado" : t.status}</span>
                    </td>
                    <td className="py-2.5 text-slate-500">{formatDate(t.createdAt)}</td>
                    <td>
                      <button onClick={() => router.push(`/tickets/${t.id}`)} className="text-blue-600 hover:text-blue-800">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
