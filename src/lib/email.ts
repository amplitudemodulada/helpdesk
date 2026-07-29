import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function sendTicketNotification(ticket: {
  id: string;
  title: string;
  clientName: string;
  clientEmail: string;
}) {
  if (!resend) return;

  await resend.emails.send({
    from: "Helpdesk <noreply@helpdesk.com>",
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
  if (!resend) return;

  await resend.emails.send({
    from: "Helpdesk <noreply@helpdesk.com>",
    to: budget.clientEmail,
    subject: `Orçamento #${budget.id.slice(0, 8)} - ${budget.ticketTitle}`,
    html: `<p>Olá <strong>${budget.clientName}</strong>,</p>
<p>Seu orçamento está disponível!</p>
<p><strong>Valor total:</strong> R$ ${budget.total.toFixed(2)}</p>
<p>Acesse o sistema para visualizar e aprovar.</p>`,
  });
}
