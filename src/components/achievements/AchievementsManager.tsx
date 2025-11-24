import React, { useEffect, useState } from 'react';
import { HttpClient } from '../../services/httpClient';
import {
  AchievementsFrontendService,
} from '../../services/achievements.service';
import { SectionsFrontendService } from '../../services/sections.service';

import AchievementCreateModal from './AchievementsCreateModal';
import AchievementEditModal from './AchievementsEditModal';

interface Achievement {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  rewardGrains: number;
  sectionId: string;
  isActive: boolean;
}

interface Section {
  id: string;
  name: string;
}

const client = new HttpClient({
  baseUrl:
    (import.meta.env.VITE_ADMIN_API_URL as string | undefined) ??
    (import.meta.env.VITE_API_URL as string | undefined) ??
    'http://localhost:3000/api',
  getToken: () => localStorage.getItem('token') ?? undefined,
});

const achievementsService = new AchievementsFrontendService(client);
const sectionsService = new SectionsFrontendService(client);

export default function AchievementsManager() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  const [createOpen, setCreateOpen] = useState(false);
  const [editAchievement, setEditAchievement] = useState<Achievement | null>(
    null
  );

  const loadData = async () => {
    setLoading(true);
    try {
      const list = await achievementsService.findAll<Achievement[]>();
      const secs = await sectionsService.findAll<Section[]>();
      setAchievements(list);
      setSections(secs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getSectionName = (id: string) =>
    sections.find((s) => s.id === id)?.name ?? '—';

  const deleteAchievement = async (id: string) => {
    if (!confirm('Удалить ачивку?')) return;
    await achievementsService.remove(id);
    await loadData();
  };

  return (
    <div className="text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Ачивки</h1>

        <button
          onClick={() => setCreateOpen(true)}
          className="px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-400"
        >
          Создать ачивку
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400">Загрузка...</p>
      ) : (
        <div className="space-y-4">
          {achievements.map((a) => (
            <div
              key={a.id}
              className="p-4 bg-[#111] border border-white/10 rounded-xl flex justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold">{a.name}</h2>
                <p className="text-gray-400">{a.description}</p>

                <p className="text-gray-300 mt-2">
                  Раздел: <span className="text-white">{getSectionName(a.sectionId)}</span>
                </p>

                <p className="text-gray-300">
                  Награда: <span className="text-white">{a.rewardGrains} зерен</span>
                </p>

                <p className="text-gray-300">
                  Активна: {a.isActive ? 'Да' : 'Нет'}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  className="px-3 py-1 bg-blue-500 rounded hover:bg-blue-400"
                  onClick={() => setEditAchievement(a)}
                >
                  Изменить
                </button>

                <button
                  className="px-3 py-1 bg-red-500 rounded hover:bg-red-400"
                  onClick={() => deleteAchievement(a.id)}
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AchievementCreateModal
        isOpen={createOpen}
        onClose={() => {
          setCreateOpen(false);
          loadData();
        }}
        sections={sections}
      />

      {editAchievement && (
        <AchievementEditModal
          isOpen={true}
          onClose={() => {
            setEditAchievement(null);
            loadData();
          }}
          achievement={editAchievement}
          sections={sections}
        />
      )}
    </div>
  );
}
