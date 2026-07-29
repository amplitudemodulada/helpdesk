"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface Ticket {
  id: string;
  title: string;
  client: { name: string };
}

export default function NewWorkRecordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedTicket = searchParams.get("ticketId") ?? "";

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [form, setForm] = useState({
    ticketId: preselectedTicket,
    description: "",
    startDate: new Date().toISOString().slice(0, 10),
    endDate: "",
    hoursSpent: "",
  });

  useEffect(() => {
    fetch("/api/tickets")
      .then((r) => r.json())
      .then(setTickets);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const body: Record<string, unknown> = {
      ticketId: form.ticketId,
      description: form.description,
      startDate: form.startDate,
    };
    if (form.endDate) body.endDate = form.endDate;
    if (form.hoursSpent) body.hoursSpent = Number(form.hoursSpent);

    const res = await fetch("/api/work-records", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) router.push("/work-records");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Novo Trabalho</h1>
      <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Ticket *</label>
          <select
            value={form.ticketId}
            onChange={(e) => setForm({ ...form, ticketId: e.target.value })}
            className="w-full border rounded-lg px-3 py-2"
            required
          >
            <option value="">Selecione...</option>
            {tickets.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title} - {t.client.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Descrição *</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border rounded-lg px-3 py-2"
            rows={3}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Data Início *</label>
          <input
            type="date"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Data Fim</label>
          <input
            type="date"
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Horas Gastas</label>
          <input
            type="number"
            value={form.hoursSpent}
            onChange={(e) => setForm({ ...form, hoursSpent: e.target.value })}
            className="w-full border rounded-lg px-3 py-2"
            min={0}
            step={0.5}
          />
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
            onClick={() => router.push("/work-records")}
            className="border px-4 py-2 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
