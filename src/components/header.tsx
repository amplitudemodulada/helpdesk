"use client";

import { signOut, useSession } from "next-auth/react";
import { LogOut, User } from "lucide-react";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <div className="h-8 w-1 bg-blue-600 rounded-full" />
        <h2 className="text-sm font-medium text-slate-500">
          Bem-vindo, <span className="text-slate-800 font-semibold">{session?.user?.name ?? "Usuário"}</span>
        </h2>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <User className="w-4 h-4" />
          <span className="text-xs capitalize">{((session?.user as { role?: string })?.role ?? "") === "admin" ? "Admin" : "Agente"}</span>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-red-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </header>
  );
}
