"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
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
  const [form, setForm] = useState({
    description: "",
    startDate: "",
    endDate: "",
    hoursSpent: "",
  });

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

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const body: Record<string, unknown> = {
      description: form.description,
      startDate: form.startDate,
    };
    if (form.endDate) body.endDate = form.endDate;
    if (form.hoursSpent) body.hoursSpent = Number(form.hoursSpent);

    await fetch(`/api/work-records/${record!.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setEditing(false);
    window.location.reload();
  }

  if (!record) return <p>Carregando...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Trabalho Realizado</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setEditing(!editing)}
            className="border px-3 py-1.5 rounded-lg text-sm hover:bg-gray-50"
          >
            {editing ? "Cancelar" : "Editar"}
          </button>
          <button
            onClick={() => router.push("/work-records")}
            className="border px-3 py-1.5 rounded-lg text-sm hover:bg-gray-50"
          >
            Voltar
          </button>
        </div>
      </div>

      {editing ? (
        <form onSubmit={handleSave} className="max-w-lg space-y-4 bg-white rounded-lg shadow-sm border p-6">
          <div>
            <label className="block text-sm font-medium mb-1">Descrição</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Data Início</label>
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
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Salvar
          </button>
        </form>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border p-6 max-w-lg">
          <div className="space-y-3">
            <p><span className="text-gray-500">Descrição:</span><br/>{record.description}</p>
            <p><span className="text-gray-500">Ticket:</span> {record.ticket.title}</p>
            <p><span className="text-gray-500">Cliente:</span> {record.ticket.client.name}</p>
            <p><span className="text-gray-500">Data Início:</span> {formatDate(record.startDate)}</p>
            {record.endDate && <p><span className="text-gray-500">Data Fim:</span> {formatDate(record.endDate)}</p>}
            {record.hoursSpent && <p><span className="text-gray-500">Horas:</span> {record.hoursSpent}h</p>}
          </div>
        </div>
      )}
    </div>
  );
}
