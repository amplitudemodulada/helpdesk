"use client";

import { signOut, useSession } from "next-auth/react";
import { LogOut, User, Menu, X } from "lucide-react";

export function Header({ onMenuToggle, mobileOpen }: { onMenuToggle: () => void; mobileOpen: boolean }) {
  const { data: session } = useSession();

  return (
    <header className="h-14 lg:h-16 bg-white border-b border-slate-200 flex items-center justify-between px-3 lg:px-6 shrink-0">
      <div className="flex items-center gap-3">
        <button onClick={onMenuToggle} className="lg:hidden p-2 -ml-1 rounded-lg hover:bg-slate-100 transition-colors">
          {mobileOpen ? <X className="w-5 h-5 text-slate-600" /> : <Menu className="w-5 h-5 text-slate-600" />}
        </button>
        <div className="hidden lg:flex items-center gap-3">
          <div className="h-8 w-1 bg-blue-600 rounded-full" />
          <h2 className="text-sm font-medium text-slate-500">
            Bem-vindo, <span className="text-slate-800 font-semibold">{session?.user?.name ?? "Usuário"}</span>
          </h2>
        </div>
      </div>
      <div className="flex items-center gap-2 lg:gap-4">
        <div className="flex items-center gap-1.5 lg:gap-2 text-xs lg:text-sm text-slate-400">
          <User className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
          <span className="capitalize">{(session?.user as { role?: string })?.role === "admin" ? "Admin" : "Agente"}</span>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-1.5 text-xs lg:text-sm text-red-600 border border-red-200 hover:bg-red-50 transition-colors px-2.5 lg:px-3 py-1.5 rounded-lg font-medium"
        >
          <LogOut className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
          <span className="hidden lg:inline">Sair</span>
        </button>
      </div>
    </header>
  );
}
