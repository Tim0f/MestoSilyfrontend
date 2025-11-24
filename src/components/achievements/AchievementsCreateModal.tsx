import React, { useState } from 'react';
import { HttpClient } from '../../services/httpClient';
import {
  AchievementsFrontendService,
  type CreateAchievementDto,
} from '../../services/achievements.service'

interface Props {
  isOpen: boolean;
  onClose: () => void;
  sections: { id: string; name: string }[];
}

const client = new HttpClient({
  baseUrl:
    (import.meta.env.VITE_ADMIN_API_URL as string | undefined) ??
    (import.meta.env.VITE_API_URL as string | undefined) ??
    'http://localhost:3000/api',
  getToken: () => localStorage.getItem('token') ?? undefined,
});

const achievementsService = new AchievementsFrontendService(client);

export default function AchievementCreateModal({
  isOpen,
  onClose,
  sections,
}: Props) {
  const [form, setForm] = useState<CreateAchievementDto>({
    name: '',
    description: '',
    iconUrl: '',
    rewardGrains: 0,
    sectionId: '',
    isActive: true,
  });

  const update = (k: keyof CreateAchievementDto, v: any) =>
    setForm((p) => ({ ...p, [k]: v }));

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    await achievementsService.create(form);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#111] border border-white/10 rounded-xl p-6 w-full max-w-lg text-white">
        <h2 className="text-xl font-bold mb-4">Создать ачивку</h2>

        <form onSubmit={create} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-300">Название</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              className="w-full bg-[#222] border border-white/10 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Описание</label>
            <textarea
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              className="w-full bg-[#222] border border-white/10 rounded px-3 py-2"
              rows={3}
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">URL иконки</label>
            <input
              type="text"
              value={form.iconUrl}
              onChange={(e) => update('iconUrl', e.target.value)}
              className="w-full bg-[#222] border border-white/10 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Награда (зерна)</label>
            <input
              type="number"
              value={form.rewardGrains}
              onChange={(e) => update('rewardGrains', Number(e.target.value))}
              className="w-full bg-[#222] border border-white/10 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Раздел</label>
            <select
              value={form.sectionId}
              onChange={(e) => update('sectionId', e.target.value)}
              className="w-full bg-[#222] border border-white/10 rounded px-3 py-2"
            >
              <option value="">Выберите раздел</option>
              {sections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => update('isActive', e.target.checked)}
              />
              Активна
            </label>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-400"
            >
              Создать
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
