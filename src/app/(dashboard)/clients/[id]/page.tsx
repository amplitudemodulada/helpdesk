"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
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
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    notes: "",
  });
  const [tickets, setTickets] = useState<Client["tickets"]>([]);

  useEffect(() => {
    fetch(`/api/clients/${params.id}`)
      .then((r) => r.json())
      .then((data: Client) => {
        setForm({
          name: data.name,
          email: data.email,
          phone: data.phone ?? "",
          company: data.company ?? "",
          notes: data.notes ?? "",
        });
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
    <div>
      <h1 className="text-2xl font-bold mb-6">Editar Cliente</h1>
      <form onSubmit={handleSubmit} className="max-w-lg space-y-4 mb-8">
        <div>
          <label className="block text-sm font-medium mb-1">Nome *</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email *</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Telefone</label>
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Empresa</label>
          <input
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Observações</label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="w-full border rounded-lg px-3 py-2"
            rows={3}
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
            onClick={() => router.push("/clients")}
            className="border px-4 py-2 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
        </div>
      </form>

      {tickets.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Atendimentos</h2>
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium text-sm">Título</th>
                  <th className="px-4 py-3 font-medium text-sm">Status</th>
                  <th className="px-4 py-3 font-medium text-sm">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {tickets.map((t) => (
                  <tr
                    key={t.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => router.push(`/tickets/${t.id}`)}
                  >
                    <td className="px-4 py-3">{t.title}</td>
                    <td className="px-4 py-3">{t.status}</td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(t.createdAt)}</td>
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
