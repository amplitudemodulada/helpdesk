"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Wrench } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface WorkRecord {
  id: string;
  description: string;
  startDate: string;
  endDate: string | null;
  hoursSpent: number | null;
  createdAt: string;
  ticket: { id: string; title: string; client: { name: string } };
}

export default function WorkRecordsPage() {
  const router = useRouter();
  const [records, setRecords] = useState<WorkRecord[]>([]);

  useEffect(() => {
    fetch("/api/work-records")
      .then((r) => r.json())
      .then(setRecords);
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Trabalhos Realizados</h1>
          <p className="text-sm text-slate-500 mt-1">{records.length} registro(s)</p>
        </div>
        <Link href="/work-records/new" className="btn-primary">
          <Plus className="w-4 h-4" />
          Novo Trabalho
        </Link>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Descrição</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Ticket</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Cliente</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Horas</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {records.map((record) => (
              <tr
                key={record.id}
                className="hover:bg-slate-50 cursor-pointer transition-colors"
                onClick={() => router.push(`/work-records/${record.id}`)}
              >
                <td className="px-4 py-3.5 text-sm font-medium text-slate-900">{record.description}</td>
                <td className="px-4 py-3.5 text-sm text-slate-500">{record.ticket.title}</td>
                <td className="px-4 py-3.5 text-sm text-slate-500">{record.ticket.client.name}</td>
                <td className="px-4 py-3.5 text-sm text-slate-600">{record.hoursSpent ? `${record.hoursSpent}h` : "—"}</td>
                <td className="px-4 py-3.5 text-sm text-slate-400">{formatDate(record.startDate)}</td>
              </tr>
            ))}
            {records.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center">
                  <Wrench className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">Nenhum trabalho registrado</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
