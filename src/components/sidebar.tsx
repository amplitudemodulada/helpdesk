"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/clients", label: "Clientes", icon: "👥" },
  { href: "/tickets", label: "Atendimentos", icon: "🎫" },
  { href: "/budgets", label: "Orçamentos", icon: "💰" },
  { href: "/work-records", label: "Trabalhos", icon: "🔧" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-4">
      <div className="text-xl font-bold mb-8 px-2">Helpdesk</div>
      <nav className="space-y-1">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                active
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              )}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
