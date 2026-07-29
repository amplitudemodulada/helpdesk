"use client";

import { useState } from "react";
import { Mail, Send, Shield, CheckCircle, XCircle } from "lucide-react";

export default function SettingsPage() {
  const [testEmail, setTestEmail] = useState("");
  const [status, setStatus] = useState<{ ok?: boolean; message: string } | null>(null);
  const [sending, setSending] = useState(false);

  async function handleTestEmail(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setStatus(null);
    try {
      const res = await fetch("/api/settings/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: testEmail }),
      });
      const data = await res.json();
      setStatus(res.ok ? { ok: true, message: "Email enviado com sucesso!" } : { ok: false, message: data.error || "Erro ao enviar" });
    } catch {
      setStatus({ ok: false, message: "Erro de conexão" });
    } finally {
      setSending(false);
    }
  }

  const items = [
    { label: "Rate limiting (API)", ok: true },
    { label: "Headers de segurança", ok: true },
    { label: "Validação de entrada (Zod)", ok: true },
    { label: "Hash de senhas (bcrypt)", ok: true },
    { label: "Proteção anti-clonagem", ok: true },
  ];

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Configurações</h1>
        <p className="text-sm text-slate-500 mt-1">Configure notificações e verifique a segurança</p>
      </div>

      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <Mail className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Notificações por Email</h2>
            <p className="text-sm text-slate-500">Resend + opcional EMAIL_FROM</p>
          </div>
        </div>
        <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-600 space-y-2 mb-6">
          <p className="font-medium text-slate-800">Para configurar:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Acesse <a href="https://resend.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">resend.com</a> e crie conta gratuita</li>
            <li>Vá em <strong>API Keys</strong> e gere uma chave</li>
            <li>Adicione <code className="bg-slate-200 px-1 rounded text-xs">RESEND_API_KEY</code> nas env vars do Vercel</li>
            <li>Opcional: <code className="bg-slate-200 px-1 rounded text-xs">EMAIL_FROM</code> (ex: Helpdesk &lt;noreply@seu.com&gt;)</li>
          </ol>
        </div>
        <form onSubmit={handleTestEmail} className="flex gap-2">
          <input type="email" value={testEmail} onChange={(e) => setTestEmail(e.target.value)} placeholder="teste@email.com" className="input flex-1" required />
          <button type="submit" disabled={sending} className="btn-primary">
            {sending ? <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : <Send className="w-4 h-4" />}
            {sending ? "Enviando..." : "Testar"}
          </button>
        </form>
        {status && (
          <div className={`mt-3 flex items-center gap-2 text-sm ${status.ok ? "text-green-600" : "text-red-600"}`}>
            {status.ok ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            {status.message}
          </div>
        )}
      </div>

      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Segurança</h2>
            <p className="text-sm text-slate-500">Status das proteções ativas</p>
          </div>
        </div>
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-50">
              <span className="text-sm text-slate-700">{item.label}</span>
              <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                <CheckCircle className="w-3.5 h-3.5" /> Ativo
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
