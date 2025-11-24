// SectionEditModal.tsx
// Модалка редактирования секции

import React, { useEffect, useState } from 'react';
import { HttpClient } from '../../services/httpClient';
import {
  SectionsFrontendService,
  type UpdateSectionDto,
} from '../../services/sections.service';

interface Props {
  id: string;
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

export default function SectionEditModal({ id, onClose }: Props) {
  const [form, setForm] = useState<UpdateSectionDto>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const data: any = await sectionsService.findOne(id);
      setForm({
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl,
        iconUrl: data.iconUrl,
        ageMin: data.ageMin,
        ageMax: data.ageMax,
        maxParticipants: data.maxParticipants,
        isActive: data.isActive,
      });
      setLoading(false);
    } catch (err: any) {
      setError(err.message ?? 'Ошибка загрузки секции');
      setLoading(false);
    }
  };

  const handleChange = (key: keyof UpdateSectionDto, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await sectionsService.update(id, form);
      onClose();
    } catch (err: any) {
      setError(err.message ?? 'Ошибка сохранения секции');
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 text-white">
        Загрузка...
      </div>
    );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#111] border border-white/10 p-8 rounded-xl w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-6">Редактировать секцию</h2>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-gray-300">Название</label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded bg-[#222] border border-white/10"
              value={form.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Описание</label>
            <textarea
              className="w-full px-3 py-2 rounded bg-[#222] border border-white/10 h-24"
              value={form.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-gray-300">Возраст (мин)</label>
              <input
                type="number"
                className="w-full px-3 py-2 rounded bg-[#222] border border-white/10"
                value={form.ageMin ?? 0}
                onChange={(e) => handleChange('ageMin', Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-300">Возраст (макс)</label>
              <input
                type="number"
                className="w-full px-3 py-2 rounded bg-[#222] border border-white/10"
                value={form.ageMax ?? 0}
                onChange={(e) => handleChange('ageMax', Number(e.target.value))}
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Макс. участников</label>
            <input
              type="number"
              className="w-full px-3 py-2 rounded bg-[#222] border border-white/10"
              value={form.maxParticipants ?? 0}
              onChange={(e) => handleChange('maxParticipants', Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">URL изображения</label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded bg-[#222] border border-white/10"
              value={form.imageUrl || ''}
              onChange={(e) => handleChange('imageUrl', e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">URL иконки</label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded bg-[#222] border border-white/10"
              value={form.iconUrl || ''}
              onChange={(e) => handleChange('iconUrl', e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!form.isActive}
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
              Сохранить изменения
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}