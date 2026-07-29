"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Shield, ShieldOff, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  createdAt: string;
}

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch("/api/users")
      .then((r) => r.json())
      .then(setUsers);
  }, []);

  async function toggleUser(user: User) {
    if (!confirm(`${user.active ? "Desativar" : "Ativar"} ${user.name}?`)) return;
    const res = await fetch(`/api/users/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !user.active }),
    });
    if (res.ok) setUsers(users.map((u) => (u.id === user.id ? { ...u, active: !u.active } : u)));
  }

  async function deleteUser(id: string, name: string) {
    if (!confirm(`Excluir ${name}?`)) return;
    const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
    if (res.ok) setUsers(users.filter((u) => u.id !== id));
    else { const data = await res.json(); alert(data.error); }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Usuários</h1>
          <p className="text-sm text-slate-500 mt-1">{users.length} usuário(s)</p>
        </div>
        <Link href="/users/new" className="btn-primary">
          <Plus className="w-4 h-4" />
          Novo Usuário
        </Link>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Nome</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Função</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Data</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3.5 text-sm font-medium text-slate-900 cursor-pointer" onClick={() => router.push(`/users/${user.id}`)}>
                  {user.name}
                </td>
                <td className="px-4 py-3.5 text-sm text-slate-500">{user.email}</td>
                <td className="px-4 py-3.5">
                  <span className={`badge ${user.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                    {user.role === "admin" ? "Admin" : "Agente"}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <span className={`badge ${user.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {user.active ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-sm text-slate-400">{formatDate(user.createdAt)}</td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1">
                    <button onClick={() => toggleUser(user)} className="btn-secondary text-xs py-1.5 px-2">
                      {user.active ? <ShieldOff className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                    </button>
                    <button onClick={() => deleteUser(user.id, user.name)} className="btn-danger text-xs py-1.5 px-2">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm text-slate-400">Nenhum usuário encontrado</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
