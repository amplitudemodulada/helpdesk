"use client";

import { signOut, useSession } from "next-auth/react";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <h2 className="text-lg font-semibold text-gray-700">
        Bem-vindo, {session?.user?.name ?? "Usuário"}
      </h2>
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="text-sm text-gray-500 hover:text-red-600 transition-colors"
      >
        Sair
      </button>
    </header>
  );
}
