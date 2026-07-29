"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  createdAt: string;
  _count?: { tickets: number };
}

export default function ClientsPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/clients")
      .then((r) => r.json())
      .then(setClients);
  }, []);

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  async function deleteClient(id: string) {
    if (!confirm("Excluir cliente?")) return;
    await fetch(`/api/clients/${id}`, { method: "DELETE" });
    setClients((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Clientes</h1>
        <Link
          href="/clients/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Novo Cliente
        </Link>
      </div>

      <input
        type="text"
        placeholder="Buscar..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border rounded-lg px-3 py-2 mb-4"
      />

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium text-sm">Nome</th>
              <th className="px-4 py-3 font-medium text-sm">Email</th>
              <th className="px-4 py-3 font-medium text-sm">Empresa</th>
              <th className="px-4 py-3 font-medium text-sm">Data</th>
              <th className="px-4 py-3 font-medium text-sm"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((client) => (
              <tr
                key={client.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => router.push(`/clients/${client.id}`)}
              >
                <td className="px-4 py-3">{client.name}</td>
                <td className="px-4 py-3 text-gray-500">{client.email}</td>
                <td className="px-4 py-3 text-gray-500">{client.company ?? "-"}</td>
                <td className="px-4 py-3 text-gray-500">{formatDate(client.createdAt)}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteClient(client.id);
                    }}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  Nenhum cliente encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
