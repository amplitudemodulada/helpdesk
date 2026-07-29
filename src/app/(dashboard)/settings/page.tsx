"use client";

import { useState } from "react";

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
      if (res.ok) setStatus({ ok: true, message: "Email enviado com sucesso!" });
      else setStatus({ ok: false, message: data.error || "Erro ao enviar" });
    } catch {
      setStatus({ ok: false, message: "Erro de conexão" });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-8">
      <h1 className="text-2xl font-bold">Configurações</h1>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold mb-4">Notificações por Email</h2>

        <div className="space-y-3 text-sm text-gray-600 mb-6">
          <p>Para enviar notificações, configure uma API key do Resend:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>
              Acesse{" "}
              <a
                href="https://resend.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                resend.com
              </a>{" "}
              e crie uma conta gratuita
            </li>
            <li>Vá em <strong>API Keys</strong> e gere uma chave</li>
            <li>
              Adicione no Vercel:{" "}
              <code className="bg-gray-100 px-1 rounded">RESEND_API_KEY</code>
            </li>
            <li>
              Opcional: configure{" "}
              <code className="bg-gray-100 px-1 rounded">EMAIL_FROM</code>{" "}
              (ex: <code className="bg-gray-100 px-1 rounded">Helpdesk &lt;noreply@seudominio.com&gt;</code>)
            </li>
            <li>Configure um domínio verificado no Resend para enviar emails</li>
          </ol>
        </div>

        <form onSubmit={handleTestEmail} className="space-y-3">
          <label className="block text-sm font-medium">
            Testar envio de email
          </label>
          <div className="flex gap-2">
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="seu@email.com"
              className="flex-1 border rounded-lg px-3 py-2"
              required
            />
            <button
              type="submit"
              disabled={sending}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {sending ? "Enviando..." : "Enviar teste"}
            </button>
          </div>
          {status && (
            <p className={`text-sm ${status.ok ? "text-green-600" : "text-red-600"}`}>
              {status.message}
            </p>
          )}
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold mb-4">Segurança</h2>
        <div className="text-sm text-gray-600 space-y-2">
          <div className="flex justify-between">
            <span>Rate limiting (API)</span>
            <span className="text-green-600">Ativo</span>
          </div>
          <div className="flex justify-between">
            <span>Headers de segurança</span>
            <span className="text-green-600">Ativo</span>
          </div>
          <div className="flex justify-between">
            <span>Validação de entrada (Zod)</span>
            <span className="text-green-600">Ativo</span>
          </div>
          <div className="flex justify-between">
            <span>Proteção anti-clonagem</span>
            <span className={process.env.NEXT_PUBLIC_APP_DOMAIN ? "text-green-600" : "text-yellow-600"}>
              {process.env.NEXT_PUBLIC_APP_DOMAIN ? "Ativo" : "APP_DOMAIN não configurado"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Hash de senhas (bcrypt)</span>
            <span className="text-green-600">Ativo</span>
          </div>
        </div>
      </div>
    </div>
  );
}
