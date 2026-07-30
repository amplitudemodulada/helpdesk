"use client";

import { useState } from "react";
import { Providers } from "@/components/providers";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Providers>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0">
          <Header onMenuToggle={() => setMobileOpen((v) => !v)} mobileOpen={mobileOpen} />
          <main className="flex-1 p-3 lg:p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </Providers>
  );
}
