"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Client {
  id: string;
  name: string;
}

export default function NewTicketPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    clientId: "",
  });

  useEffect(() => {
    fetch("/api/clients")
      .then((r) => r.json())
      .then(setClients);
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
    <div>
      <h1 className="text-2xl font-bold mb-6">Novo Atendimento</h1>
      <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Cliente *</label>
          <select
            value={form.clientId}
            onChange={(e) => setForm({ ...form, clientId: e.target.value })}
            className="w-full border rounded-lg px-3 py-2"
            required
          >
            <option value="">Selecione...</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Título *</label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Descrição</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border rounded-lg px-3 py-2"
            rows={4}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Prioridade</label>
          <select
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="low">Baixa</option>
            <option value="medium">Média</option>
            <option value="high">Alta</option>
            <option value="urgent">Urgente</option>
          </select>
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Salvar
          </button>
          <button
            type="button"
            onClick={() => router.push("/tickets")}
            className="border px-4 py-2 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
