import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date));
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function statusColor(status: string) {
  const colors: Record<string, string> = {
    open: "bg-blue-100 text-blue-800",
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    closed: "bg-gray-100 text-gray-800",
    in_progress: "bg-purple-100 text-purple-800",
    sent: "bg-indigo-100 text-indigo-800",
  };
  return colors[status] ?? "bg-gray-100 text-gray-800";
}

export function statusLabel(status: string) {
  const labels: Record<string, string> = {
    open: "Aberto",
    pending: "Pendente",
    approved: "Aprovado",
    rejected: "Recusado",
    closed: "Fechado",
    in_progress: "Em Andamento",
    sent: "Enviado",
  };
  return labels[status] ?? status;
}
