import { Resend } from "resend";

let resendInstance: Resend | null = null;

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!resendInstance) resendInstance = new Resend(key);
  return resendInstance;
}

export function isEmailConfigured(): boolean {
  return !!process.env.RESEND_API_KEY;
}

export async function sendTestEmail(to: string): Promise<{ ok: boolean; error?: string }> {
  const r = getResend();
  if (!r) return { ok: false, error: "RESEND_API_KEY não configurada" };

  try {
    await r.emails.send({
      from: process.env.EMAIL_FROM || "Helpdesk <noreply@helpdesk.com>",
      to,
      subject: "Teste de configuração de email",
      html: "<p>Se você recebeu este email, a configuração de notificações está funcionando!</p>",
    });
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

export async function sendTicketNotification(ticket: {
  id: string;
  title: string;
  clientName: string;
  clientEmail: string;
}) {
  const r = getResend();
  if (!r) return;

  await r.emails.send({
    from: process.env.EMAIL_FROM || "Helpdesk <noreply@helpdesk.com>",
    to: ticket.clientEmail,
    subject: `Ticket #${ticket.id.slice(0, 8)}: ${ticket.title}`,
    html: `<p>Olá <strong>${ticket.clientName}</strong>,</p>
<p>Seu ticket foi registrado com sucesso!</p>
<p><strong>ID:</strong> #${ticket.id.slice(0, 8)}</p>
<p><strong>Título:</strong> ${ticket.title}</p>
<p>Acompanhe pelo nosso sistema.</p>`,
  });
}

export async function sendBudgetNotification(budget: {
  id: string;
  ticketTitle: string;
  total: number;
  clientName: string;
  clientEmail: string;
}) {
  const r = getResend();
  if (!r) return;

  await r.emails.send({
    from: process.env.EMAIL_FROM || "Helpdesk <noreply@helpdesk.com>",
    to: budget.clientEmail,
    subject: `Orçamento #${budget.id.slice(0, 8)} - ${budget.ticketTitle}`,
    html: `<p>Olá <strong>${budget.clientName}</strong>,</p>
<p>Seu orçamento está disponível!</p>
<p><strong>Valor total:</strong> R$ ${budget.total.toFixed(2)}</p>
<p>Acesse o sistema para visualizar e aprovar.</p>`,
  });
}
