// EventsList.tsx
// Список событий с редактированием и удалением

import React, { useEffect, useState } from 'react';
import { HttpClient } from '../../services/httpClient';
import { EventsFrontendService } from '../../services/events.service';

interface EventItem {
  id: string;
  name: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  maxParticipants: number;
  textColor: string;
  imageUrl: string;
  bannerUrl: string;
  createdBy: string;
}

interface Props {
  onEdit: (id: string) => void;
}

const client = new HttpClient({
  baseUrl:
    (import.meta.env.VITE_ADMIN_API_URL as string | undefined) ??
    (import.meta.env.VITE_API_URL as string | undefined) ??
    'http://localhost:3000/api',
  getToken: () => localStorage.getItem('token') ?? undefined,
});

const eventsService = new EventsFrontendService(client);

export default function EventsList({ onEdit }: Props) {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const res: any = await eventsService.findAll();
      setEvents(Array.isArray(res) ? res : []);
    } catch (err: any) {
      setError(err.message ?? 'Ошибка загрузки событий');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить событие?')) return;

    try {
      await eventsService.remove(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (err: any) {
      alert(err.message ?? 'Ошибка удаления');
    }
  };

  if (loading) return <p className="text-gray-300">Загрузка...</p>;
  if (error) return <p className="text-red-400">{error}</p>;

  return (
    <div className="space-y-4">
      {events.map((ev) => (
        <div
          key={ev.id}
          className="flex justify-between items-center bg-[#1a1a1a] border border-white/10 px-5 py-4 rounded-xl hover:bg-white/5"
        >
          <div className="space-y-1">
            <p className="text-lg font-semibold">{ev.title}</p>
            <p className="text-gray-400 text-sm">{ev.description}</p>
            <p className="text-gray-400 text-sm">Дата: {ev.date}</p>
            <p className="text-gray-400 text-sm">
              Время: {ev.startTime} — {ev.endTime}
            </p>
            <p className="text-gray-500 text-sm">Цена: {ev.price}₽</p>
            <p className="text-gray-500 text-sm">Максимум участников: {ev.maxParticipants}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => onEdit(ev.id)}
              className="px-4 py-2 bg-blue-500 text-black rounded hover:bg-blue-400"
            >
              Редактировать
            </button>

            <button
              onClick={() => handleDelete(ev.id)}
              className="px-4 py-2 bg-red-500 text-black rounded hover:bg-red-400"
            >
              Удалить
            </button>
          </div>
        </div>
      ))}

      {!events.length && (
        <p className="text-gray-400 p-4 text-center">Событий пока нет</p>
      )}
    </div>
  );
}
