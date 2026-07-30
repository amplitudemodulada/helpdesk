"use client";

import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell,
} from "recharts";
import { BarChart3, TrendingUp, DollarSign, Ticket, Percent } from "lucide-react";

interface ReportData {
  monthLabels: string[];
  ticketsByMonth: number[];
  revenueByMonth: number[];
  totalRevenue: number;
  totalTickets: number;
  openTickets: number;
  approvalRate: number;
  statusDistribution: { name: string; value: number }[];
  priorityCounts: { name: string; value: number }[];
  clientRanking: { name: string; tickets: number }[];
}

const COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#ec4899"];

export default function ReportsPage() {
  const [data, setData] = useState<ReportData | null>(null);

  useEffect(() => {
    fetch("/api/reports").then((r) => r.json()).then(setData);
  }, []);

  if (!data) return <p className="text-slate-500">Carregando relatórios...</p>;

  const ticketsChart = data.monthLabels.map((label, i) => ({ mes: label, tickets: data.ticketsByMonth[i], receita: data.revenueByMonth[i] }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Relatórios</h1>
        <p className="text-sm text-slate-500 mt-1">Visão geral com gráficos dos últimos 12 meses</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Ticket} label="Total de Tickets" value={data.totalTickets} color="blue" />
        <StatCard icon={TrendingUp} label="Em Aberto" value={data.openTickets} color="amber" />
        <StatCard icon={DollarSign} label="Receita Total" value={`R$ ${(data.totalRevenue).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} color="emerald" />
        <StatCard icon={Percent} label="Taxa de Fechamento" value={`${data.approvalRate}%`} color="violet" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Tickets por Mês" icon={Ticket}>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={ticketsChart}>
              <XAxis dataKey="mes" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip />
              <Line type="monotone" dataKey="tickets" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Receita por Mês (Orçamentos Aprovados)" icon={DollarSign}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={ticketsChart}>
              <XAxis dataKey="mes" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip formatter={(v: unknown) => `R$ ${Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} />
              <Bar dataKey="receita" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Distribuição por Status" icon={TrendingUp}>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={data.statusDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, value }) => `${name}: ${value}`}>
                {data.statusDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Prioridade dos Tickets" icon={BarChart3}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.priorityCounts} layout="vertical">
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} stroke="#94a3b8" width={70} />
              <Tooltip />
              <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Top 10 Clientes" icon={UsersIcon}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 text-slate-600 font-medium">#</th>
                <th className="text-left py-2 text-slate-600 font-medium">Cliente</th>
                <th className="text-right py-2 text-slate-600 font-medium">Tickets</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.clientRanking.map((c, i) => (
                <tr key={c.name} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2 text-slate-400 w-8">{i + 1}</td>
                  <td className="py-2 text-slate-800">{c.name}</td>
                  <td className="py-2 text-right font-medium text-slate-800">{c.tickets}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string | number; color: string }) {
  const colors: Record<string, string> = { blue: "bg-blue-100 text-blue-600", amber: "bg-amber-100 text-amber-600", emerald: "bg-emerald-100 text-emerald-600", violet: "bg-violet-100 text-violet-600" };
  return (
    <div className="card p-5">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-slate-500">{label}</p>
          <p className="text-xl font-bold text-slate-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, icon: Icon, children }: { title: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-4 h-4 text-slate-500" />
        <h2 className="font-semibold text-slate-900">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
}
