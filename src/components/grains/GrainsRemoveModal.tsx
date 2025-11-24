// src/components/grains/GrainsRemoveModal.tsx
import React, { useState } from 'react';
import { HttpClient } from '../../services/httpClient';
import { GrainsFrontendService } from '../../services/grains.service';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onUpdated?: () => void;
}

const client = new HttpClient({
  baseUrl:
    (import.meta.env.VITE_ADMIN_API_URL as string | undefined) ??
    (import.meta.env.VITE_API_URL as string | undefined) ??
    'http://localhost:3000/api',
  getToken: () => localStorage.getItem('token') ?? undefined,
});

const grainsService = new GrainsFrontendService(client);

export default function GrainsRemoveModal({ isOpen, onClose, userId, onUpdated }: Props) {
  const [amount, setAmount] = useState<number>(0);
  const [reason, setReason] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!userId) {
      setError('Нет выбранного пользователя');
      return;
    }

    if (amount <= 0) {
      setError('Количество должно быть больше 0');
      return;
    }

    setLoading(true);
    try {
      await grainsService.deduct({ userId, amount, reason });
      onUpdated?.();
      onClose();
    } catch (err: any) {
      setError(err?.message ?? 'Ошибка при списании');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-[#111] border border-white/10 p-6 rounded-xl w-full max-w-md text-white">
        <h3 className="text-xl font-bold mb-4">Списать зерна</h3>

        {error && <div className="text-red-400 mb-2">{error}</div>}

        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="block mb-1 text-gray-300">Количество</label>
            <input
              type="number"
              min={1}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-[#222] border border-white/10 px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Причина (опционально)</label>
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-[#222] border border-white/10 px-3 py-2 rounded"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500">
              Отмена
            </button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-red-600 text-black rounded hover:bg-red-500">
              Списать
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
