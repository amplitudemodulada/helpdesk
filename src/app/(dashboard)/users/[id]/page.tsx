"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Shield, User, Mail, Lock, CheckCircle, XCircle } from "lucide-react";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  createdAt: string;
}

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "agent" });
  const [active, setActive] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/users/${params.id}`)
      .then((r) => r.json())
      .then((data: UserData) => {
        setForm({ name: data.name, email: data.email, password: "", role: data.role });
        setActive(data.active);
      });
  }, [params.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const body: Record<string, unknown> = { name: form.name, email: form.email, role: form.role, active };
    if (form.password) body.password = form.password;

    const res = await fetch(`/api/users/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
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
        <ArrowLeft className="w-4 h-4" /> Voltar para Usuários
      </button>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Editar Usuário</h1>

      <form onSubmit={handleSubmit} className="card p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1"><User className="w-3.5 h-3.5 inline" /> Nome *</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1"><Mail className="w-3.5 h-3.5 inline" /> Email *</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1"><Lock className="w-3.5 h-3.5 inline" /> Nova senha</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input" minLength={6} placeholder="Deixe em branco para manter" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1"><Shield className="w-3.5 h-3.5 inline" /> Função</label>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="input">
              <option value="agent">Agente</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 py-2">
          <button type="button" onClick={() => setActive(!active)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${active ? "bg-emerald-500" : "bg-slate-300"}`}>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${active ? "translate-x-6" : "translate-x-1"}`} />
          </button>
          <span className="flex items-center gap-1.5 text-sm text-slate-700">
            {active ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-slate-400" />}
            {active ? "Usuário ativo" : "Usuário inativo"}
          </span>
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
