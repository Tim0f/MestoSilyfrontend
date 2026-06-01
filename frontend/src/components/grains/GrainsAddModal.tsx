// src/components/grains/GrainsAddModal.tsx
import React, { useState } from 'react';
import { Client } from '../../services/httpClient';
import { GrainsFrontendService } from '../../services/grains.service';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onUpdated?: () => void;
}

const client = Client;

const grainsService = new GrainsFrontendService(client);

export default function GrainsAddModal({ isOpen, onClose, userId, onUpdated }: Props) {
  const [amount, setAmount] = useState<number>(0);
  const [reason, setReason] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!userId) return setError('Нет пользователя');
    if (amount <= 0) return setError('Количество должно быть > 0');

    setLoading(true);
    try {
      await grainsService.add({ userId, amount, reason });
      onUpdated?.();
      onClose();
    } catch (err: any) {
      setError(err?.message ?? 'Ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-customblack/60">
      <div className="bg-customgrey p-6 rounded-xl w-full max-w-md text-customwhite">
        <h3 className="text-xl font-bold mb-4">Начислить зерна</h3>

        {error && <div className="text-[#FF6B4A] mb-2">{error}</div>}

        <form onSubmit={submit} className="space-y-3">
          <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full px-3 py-2 rounded bg-[#222] border border-customwhite/10" placeholder="Количество" required />
          <input value={reason} onChange={(e) => setReason(e.target.value)} className="w-full px-3 py-2 rounded bg-[#222] border border-customwhite/10" placeholder="Причина (опционально)" />
          <div className="flex justify-end gap-3 pt-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 rounded">Отмена</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-green-500 text-customblack rounded">Начислить</button>
          </div>
        </form>
      </div>
    </div>
  );
}
