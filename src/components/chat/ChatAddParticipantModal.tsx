// src/components/chat/ChatAddParticipantModal.tsx
import React, { useState } from 'react';
import { HttpClient } from '../../services/httpClient';
import { ChatFrontendService } from '../../services/chat.service';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  chat: {
    id: string;
    participants?: { user: { id: string; firstName?: string; lastName?: string } }[];
  } | null;
  reload?: () => Promise<void> | void;
}

const client = new HttpClient({
  baseUrl:
    (import.meta.env.VITE_ADMIN_API_URL as string | undefined) ??
    (import.meta.env.VITE_API_URL as string | undefined) ??
    'http://localhost:3000/api',
  getToken: () => localStorage.getItem('token') ?? undefined,
});

const chatService = new ChatFrontendService(client);

export default function ChatAddParticipantModal({ isOpen, onClose, chat, reload }: Props) {
  const [userId, setUserId] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !chat) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId && !userEmail) {
      alert('Укажите ID или email пользователя');
      return;
    }
    setLoading(true);
    try {
      // backend expects userId in body for addParticipant
      if (userId) {
        await chatService.addParticipant(chat.id, userId);
      } else {
        // if backend supports adding by email, try endpoint (fallback)
        await client.post(`/chat/${chat.id}/participants`, { email: userEmail });
      }
      if (reload) await reload();
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(err?.message ?? 'Ошибка добавления участника');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#111] p-5 rounded-xl w-full max-w-md text-white border border-white/10">
        <h3 className="text-lg font-semibold mb-3">Добавить участника</h3>

        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="block mb-1 text-gray-300">ID пользователя</label>
            <input
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="cmi..."
              className="w-full bg-[#222] px-3 py-2 rounded border border-white/10"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Или email</label>
            <input
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full bg-[#222] px-3 py-2 rounded border border-white/10"
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 rounded">
              Отмена
            </button>

            <button type="submit" disabled={loading} className="px-4 py-2 bg-green-600 rounded">
              {loading ? 'Добавление...' : 'Добавить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
