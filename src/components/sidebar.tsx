"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Ticket,
  Receipt,
  Wrench,
  Shield,
  Settings,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/clients", label: "Clientes", icon: Users },
  { href: "/tickets", label: "Atendimentos", icon: Ticket },
  { href: "/budgets", label: "Orçamentos", icon: Receipt },
  { href: "/work-records", label: "Trabalhos", icon: Wrench },
  { href: "/reports", label: "Relatórios", icon: BarChart3 },
  { href: "/users", label: "Usuários", icon: Shield },
  { href: "/settings", label: "Configurações", icon: Settings },
];

export function Sidebar({ mobileOpen, onClose }: { mobileOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();

  const content = (
    <div className="flex flex-col h-full">
      <div className="p-4 lg:p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <Ticket className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="font-bold text-base lg:text-lg leading-tight text-white">Helpdesk</h1>
            <p className="text-xs text-slate-400 truncate">Sistema de Atendimento</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                active
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              )}
            >
              <Icon className={cn("w-5 h-5 shrink-0", active ? "text-white" : "text-slate-400")} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <p className="text-xs text-slate-500">v1.0.0</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}
      {/* Mobile sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 z-50 w-64 h-screen bg-slate-900 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        {content}
      </aside>
      {/* Desktop sidebar spacer */}
      <aside className="hidden lg:flex w-64 shrink-0 min-h-screen">
        {content}
      </aside>
    </>
  );
}
