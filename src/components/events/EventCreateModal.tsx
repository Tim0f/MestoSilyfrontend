// EventCreateModal.tsx
// Модалка создания события

import React, { useState } from 'react';
import { Client } from '../../services/httpClient';
import {
  EventsFrontendService,
  type CreateEventDto,
} from '../../services/events.service';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const client = Client

const eventsService = new EventsFrontendService(client);

export default function EventCreateModal({ isOpen, onClose }: Props) {
  const [form, setForm] = useState<CreateEventDto>({
    name: '',
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    price: 0,
    maxParticipants: 0,
    textColor: '#ffffff',
    imageUrl: '',
    bannerUrl: '',
    createdBy: localStorage.getItem('userId') || '',
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (key: keyof CreateEventDto, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Корректный ISO-формат
      const payload = {
        ...form,
        date: new Date(`${form.date}T${form.startTime}:00`).toISOString(),
      };

      await eventsService.create(payload);

      onClose();
    } catch (err: any) {
      setError(err.message ?? 'Ошибка создания события');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#111] border border-white/10 p-8 rounded-xl w-full max-w-xl max-h-[90vh] overflow-y-auto text-white">
        <h2 className="text-2xl font-bold mb-6">Создать событие</h2>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-gray-300">Служебное имя (name)</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#222] border border-white/10"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Заголовок</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#222] border border-white/10"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Описание</label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#222] border border-white/10"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Дата</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => handleChange('date', e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#222] border border-white/10"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-gray-300">Начало</label>
              <input
                type="time"
                value={form.startTime}
                onChange={(e) => handleChange('startTime', e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#222] border border-white/10"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-300">Окончание</label>
              <input
                type="time"
                value={form.endTime}
                onChange={(e) => handleChange('endTime', e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#222] border border-white/10"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Цена</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => handleChange('price', Number(e.target.value))}
              className="w-full px-3 py-2 rounded bg-[#222] border border-white/10"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Максимум участников</label>
            <input
              type="number"
              value={form.maxParticipants}
              onChange={(e) => handleChange('maxParticipants', Number(e.target.value))}
              className="w-full px-3 py-2 rounded bg-[#222] border border-white/10"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Цвет текста</label>
            <input
              type="color"
              value={form.textColor}
              onChange={(e) => handleChange('textColor', e.target.value)}
              className="w-full h-10 bg-[#222] border border-white/10 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">URL изображения</label>
            <input
              type="text"
              value={form.imageUrl}
              onChange={(e) => handleChange('imageUrl', e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#222] border border-white/10"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">URL баннера</label>
            <input
              type="text"
              value={form.bannerUrl}
              onChange={(e) => handleChange('bannerUrl', e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#222] border border-white/10"
              required
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
            >
              Отмена
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-yellow-500 text-black rounded font-semibold hover:bg-yellow-400 disabled:opacity-60"
            >
              Создать
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
