"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft } from "lucide-react";

export default function NewClientPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "", email: "", phone: "", company: "", notes: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) router.push("/clients");
  }

  return (
    <div className="max-w-2xl">
      <button onClick={() => router.push("/clients")} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </button>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Novo Cliente</h1>
      <form onSubmit={handleSubmit} className="card p-6 space-y-5">
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
            <label className="block text-sm font-medium text-slate-700 mb-1">Telefone</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Empresa</label>
            <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="input" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Observações</label>
          <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input" rows={3} />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" className="btn-primary"><Save className="w-4 h-4" /> Salvar</button>
          <button type="button" onClick={() => router.push("/clients")} className="btn-secondary">Cancelar</button>
        </div>
      </form>
    </div>
  );
}
