"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface Ticket {
  id: string;
  title: string;
  client: { name: string };
}

interface Item {
  description: string;
  quantity: number;
  unitPrice: number;
}

export default function NewBudgetPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedTicket = searchParams.get("ticketId") ?? "";

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketId, setTicketId] = useState(preselectedTicket);
  const [items, setItems] = useState<Item[]>([
    { description: "", quantity: 1, unitPrice: 0 },
  ]);

  useEffect(() => {
    fetch("/api/tickets")
      .then((r) => r.json())
      .then(setTickets);
  }, []);

  function addItem() {
    setItems([...items, { description: "", quantity: 1, unitPrice: 0 }]);
  }

  function updateItem(i: number, field: keyof Item, value: string | number) {
    const newItems = [...items];
    (newItems[i] as Record<string, unknown>)[field] = value;
    setItems(newItems);
  }

  function removeItem(i: number) {
    setItems(items.filter((_, idx) => idx !== i));
  }

  const total = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/budgets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticketId, items, total }),
    });
    if (res.ok) router.push("/budgets");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Novo Orçamento</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Ticket *</label>
          <select
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            required
          >
            <option value="">Selecione...</option>
            {tickets.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title} - {t.client.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Itens</label>
            <button
              type="button"
              onClick={addItem}
              className="text-sm text-blue-600 hover:underline"
            >
              + Adicionar item
            </button>
          </div>
          <div className="space-y-2">
            {items.map((item, i) => (
              <div key={i} className="flex gap-2 items-start">
                <input
                  placeholder="Descrição"
                  value={item.description}
                  onChange={(e) => updateItem(i, "description", e.target.value)}
                  className="flex-1 border rounded-lg px-3 py-2"
                  required
                />
                <input
                  type="number"
                  placeholder="Qtd"
                  value={item.quantity}
                  onChange={(e) => updateItem(i, "quantity", Number(e.target.value))}
                  className="w-20 border rounded-lg px-3 py-2"
                  min={1}
                  required
                />
                <input
                  type="number"
                  placeholder="Valor"
                  value={item.unitPrice}
                  onChange={(e) => updateItem(i, "unitPrice", Number(e.target.value))}
                  className="w-28 border rounded-lg px-3 py-2"
                  min={0}
                  step={0.01}
                  required
                />
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(i)}
                    className="text-red-500 px-2 py-2"
                  >
                    X
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="text-xl font-bold">
          Total: {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(total)}
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Salvar
          </button>
          <button
            type="button"
            onClick={() => router.push("/budgets")}
            className="border px-4 py-2 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
