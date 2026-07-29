"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
        <h1 className="text-2xl font-bold">Trabalhos Realizados</h1>
        <Link
          href="/work-records/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Novo Trabalho
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium text-sm">Descrição</th>
              <th className="px-4 py-3 font-medium text-sm">Ticket</th>
              <th className="px-4 py-3 font-medium text-sm">Cliente</th>
              <th className="px-4 py-3 font-medium text-sm">Horas</th>
              <th className="px-4 py-3 font-medium text-sm">Data</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {records.map((record) => (
              <tr
                key={record.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => router.push(`/work-records/${record.id}`)}
              >
                <td className="px-4 py-3 font-medium">{record.description}</td>
                <td className="px-4 py-3 text-gray-500">{record.ticket.title}</td>
                <td className="px-4 py-3 text-gray-500">{record.ticket.client.name}</td>
                <td className="px-4 py-3">{record.hoursSpent ? `${record.hoursSpent}h` : "-"}</td>
                <td className="px-4 py-3 text-gray-500">{formatDate(record.startDate)}</td>
              </tr>
            ))}
            {records.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  Nenhum trabalho registrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
