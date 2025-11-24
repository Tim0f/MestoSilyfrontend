// src/components/grains/GrainsTransferModal.tsx
import React, { useEffect, useState } from 'react';
import { HttpClient } from '../../services/httpClient';
import { GrainsFrontendService } from '../../services/grains.service';
import { UsersFrontendService } from '../../services/users.service';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  // fromUser - если админ переводит от имени выбранного пользователя
  fromUserId?: string;
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
const usersService = new UsersFrontendService(client);

export default function GrainsTransferModal({ isOpen, onClose, fromUserId, onUpdated }: Props) {
  const [toUserId, setToUserId] = useState<string>('');
  const [toUserEmail, setToUserEmail] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [message, setMessage] = useState<string>('');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      try {
        const res: any = await usersService.findAll();
        const parsed = (res && (res as any).data) ? (res as any).data : res;
        setUsers(Array.isArray(parsed) ? parsed : []);
      } catch (e) {
        console.error(e);
        setUsers([]);
      }
    })();
  }, [isOpen]);

  if (!isOpen) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!toUserId && !toUserEmail) {
      setError('Укажите ID получателя или Email');
      return;
    }
    if (amount <= 0) {
      setError('Количество должно быть > 0');
      return;
    }

    setLoading(true);
    try {
      // Формируем payload по TransferGrainsDto (без fromUserId — сервер разберётся кто переводит)
      const payload: any = {
        toUserId: toUserId || undefined,
        toUserEmail: toUserEmail || undefined,
        amount,
        message: message || undefined,
      };

      await grainsService.transfer(payload);
      onUpdated?.();
      onClose();
    } catch (err: any) {
      setError(err?.message ?? 'Ошибка перевода');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-[#111] border border-white/10 p-6 rounded-xl w-full max-w-md text-white">
        <h3 className="text-xl font-bold mb-4">Перевести зерна</h3>

        {error && <div className="text-red-400 mb-2">{error}</div>}

        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="block mb-1 text-gray-300">ID получателя (опционально)</label>
            <input value={toUserId} onChange={(e) => setToUserId(e.target.value)} className="w-full px-3 py-2 rounded bg-[#222] border border-white/10" />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Email получателя (опционально)</label>
            <input value={toUserEmail} onChange={(e) => setToUserEmail(e.target.value)} className="w-full px-3 py-2 rounded bg-[#222] border border-white/10" />
            <div className="text-sm text-gray-400 mt-1">Укажите либо ID, либо Email</div>
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Сумма</label>
            <input type="number" min={1} value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full px-3 py-2 rounded bg-[#222] border border-white/10" />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Сообщение (опционально)</label>
            <input value={message} onChange={(e) => setMessage(e.target.value)} className="w-full px-3 py-2 rounded bg-[#222] border border-white/10" />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 rounded">Отмена</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-yellow-500 text-black rounded">Перевести</button>
          </div>
        </form>
      </div>
    </div>
  );
}
