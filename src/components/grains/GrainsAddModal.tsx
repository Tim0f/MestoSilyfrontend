import React, { useState } from "react";
import { HttpClient } from "../../services/httpClient";
import { GrainsFrontendService } from "../../services/grains.service";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

const client = new HttpClient({
  baseUrl:
    (import.meta.env.VITE_ADMIN_API_URL as string) ||
    (import.meta.env.VITE_API_URL as string) ||
    "http://localhost:3000/api",
  getToken: () => localStorage.getItem("token") ?? undefined,
});

const grainsService = new GrainsFrontendService(client);

export default function GrainsAddModal({ isOpen, onClose, userId }: Props) {
  const [amount, setAmount] = useState<number>(0);
  const [reason, setReason] = useState<string>("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    await grainsService.add({
      userId,
      amount,
      reason,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#111] border border-white/10 p-6 rounded-xl w-full max-w-md text-white">
        <h2 className="text-xl font-bold mb-4">Начислить зёрна</h2>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-300">Количество</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-3 py-2 bg-[#222] border border-white/10 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Причина</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 bg-[#222] border border-white/10 rounded"
              rows={3}
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
            >
              Отмена
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-green-600 rounded hover:bg-green-500"
            >
              Начислить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
