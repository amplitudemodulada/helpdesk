"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft } from "lucide-react";

export default function NewUserPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "agent" });
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) router.push("/users");
    else {
      const data = await res.json();
      setError(typeof data.error === "string" ? data.error : JSON.stringify(data.error));
    }
  }

  return (
    <div className="max-w-2xl">
      <button onClick={() => router.push("/users")} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </button>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Novo Usuário</h1>
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
            <label className="block text-sm font-medium text-slate-700 mb-1">Senha * (mín. 6)</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input" minLength={6} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Função</label>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="input">
              <option value="agent">Agente</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
        {error && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3"><p className="text-red-600 text-sm">{error}</p></div>}
        <div className="flex gap-3 pt-2">
          <button type="submit" className="btn-primary"><Save className="w-4 h-4" /> Salvar</button>
          <button type="button" onClick={() => router.push("/users")} className="btn-secondary">Cancelar</button>
        </div>
      </form>
    </div>
  );
}
