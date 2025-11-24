// SectionCreateModal.tsx
// Модалка создания секции

import React, { useState } from 'react';
import { HttpClient } from '../../services/httpClient';
import {
  SectionsFrontendService,
  type CreateSectionDto,
} from '../../services/sections.service';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const client = new HttpClient({
  baseUrl:
    (import.meta.env.VITE_ADMIN_API_URL as string | undefined) ??
    (import.meta.env.VITE_API_URL as string | undefined) ??
    'http://localhost:3000/api',
  getToken: () => localStorage.getItem('token') ?? undefined,
});

const sectionsService = new SectionsFrontendService(client);

export default function SectionCreateModal({ isOpen, onClose }: Props) {
  const [form, setForm] = useState<CreateSectionDto>({
    name: '',
    description: '',
    imageUrl: '',
    iconUrl: '',
    ageMin: 0,
    ageMax: 0,
    maxParticipants: 0,
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChange = (key: keyof CreateSectionDto, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await sectionsService.create(form);
      onClose();
    } catch (err: any) {
      setError(err.message ?? 'Ошибка создания секции');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#111] border border-white/10 p-8 rounded-xl w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-6">Создать секцию</h2>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-gray-300">Название</label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded bg-[#222] border border-white/10"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Описание</label>
            <textarea
              className="w-full px-3 py-2 rounded bg-[#222] border border-white/10 h-24"
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-gray-300">Возраст (мин)</label>
              <input
                type="number"
                className="w-full px-3 py-2 rounded bg-[#222] border border-white/10"
                value={form.ageMin}
                onChange={(e) => handleChange('ageMin', Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-300">Возраст (макс)</label>
              <input
                type="number"
                className="w-full px-3 py-2 rounded bg-[#222] border border-white/10"
                value={form.ageMax}
                onChange={(e) => handleChange('ageMax', Number(e.target.value))}
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Макс. участников</label>
            <input
              type="number"
              className="w-full px-3 py-2 rounded bg-[#222] border border-white/10"
              value={form.maxParticipants}
              onChange={(e) => handleChange('maxParticipants', Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">URL изображения</label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded bg-[#222] border border-white/10"
              value={form.imageUrl}
              onChange={(e) => handleChange('imageUrl', e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">URL иконки</label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded bg-[#222] border border-white/10"
              value={form.iconUrl}
              onChange={(e) => handleChange('iconUrl', e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => handleChange('isActive', e.target.checked)}
            />
            <label className="text-gray-300">Активна</label>
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
              {loading ? 'Создание...' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}