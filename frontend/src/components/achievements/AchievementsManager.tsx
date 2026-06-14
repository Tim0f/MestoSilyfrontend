import { useEffect, useState, lazy, Suspense } from 'react';
import { Client } from '../../services/httpClient';
import {
  AchievementsFrontendService,
} from '../../services/achievements.service';
import { SectionsFrontendService } from '../../services/sections.service';

const AchievementCreateModal = lazy(
  () => import('./AchievementsCreateModal')
);

const AchievementEditModal = lazy(
  () => import('./AchievementsEditModal')
);

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

const client = Client;

const achievementsService = new AchievementsFrontendService(client);
const sectionsService = new SectionsFrontendService(client);

export default function AchievementsManager() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [createOpen, setCreateOpen] = useState(false);
  const [editAchievement, setEditAchievement] = useState<Achievement | null>(null);

  // Модалка выдачи ачивки
  const [issueAchievement, setIssueAchievement] = useState<Achievement | null>(null);
  const [issueCode, setIssueCode] = useState<string | null>(null);
  const [issuing, setIssuing] = useState(false);

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

  // Генерация кода выдачи
  const handleIssue = async (achievement: Achievement) => {
    setIssueAchievement(achievement);
    setIssueCode(null);
    setIssuing(true);
    try {
const result = await achievementsService.generateCode<{ code: string }>(achievement.id);
      setIssueCode(result.code);
    } catch (err) {
      console.error('Ошибка генерации кода:', err);
      alert('Не удалось сгенерировать код');
      setIssueAchievement(null);
    } finally {
      setIssuing(false);
    }
  };

  const closeIssueModal = () => {
    setIssueAchievement(null);
    setIssueCode(null);
  };

  const copyCode = () => {
    if (issueCode) {
      navigator.clipboard.writeText(issueCode);
      alert('Код скопирован!');
    }
  };

  // Фильтрация по названию
  const filteredAchievements = achievements.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="text-customwhite p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-h2 font-bold">Ачивки</h1>

        <button
          onClick={() => setCreateOpen(true)}
          className="px-4 py-2 bg-customyellow text-customblack rounded hover:bg-customyellow"
        >
          Создать ачивку
        </button>
      </div>

      {/* Поиск */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Поиск по названию..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md bg-customblack border border-customwhite/10 rounded px-3 py-2"
        />
      </div>

      {loading ? (
        <p className="text-customgrey">Загрузка...</p>
      ) : (
        <div className="space-y-4">
          {filteredAchievements.map((a) => (
            <div
              key={a.id}
              className="p-4 bg-customgrey border border-customwhite/10 rounded-xl flex flex-col md:flex-row md:justify-between gap-4 md:gap-0"
            >
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{a.name}</h2>
                <p className="text-customgrey line-clamp-3">{a.description}</p>

                <p className="text-customwhite mt-2">
                  Секция: <span className="text-customwhite">{getSectionName(a.sectionId)}</span>
                </p>

                <p className="text-customwhite">
                  Награда: <span className="text-customwhite">{a.rewardGrains} зерен</span>
                </p>

                <p className="text-customwhite">
                  Активна: {a.isActive ? 'Да' : 'Нет'}
                </p>
              </div>

              <div className="flex flex-row md:flex-col gap-2 md:items-end">
                <button
                  className="w-full md:w-auto px-3 py-1 bg-[#5BC0EB] rounded hover:bg-blue-400"
                  onClick={() => setEditAchievement(a)}
                >
                  Изменить
                </button>

                <button
                  className="w-full md:w-auto px-3 py-1 bg-green-500 rounded hover:bg-green-400"
                  onClick={() => handleIssue(a)}
                >
                  Выдать
                </button>

                <button
                  className="w-full md:w-auto px-3 py-1 bg-red-500 rounded hover:bg-[#FF6B4A]"
                  onClick={() => deleteAchievement(a.id)}
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
          {filteredAchievements.length === 0 && !loading && (
            <p className="text-customgrey">Ничего не найдено</p>
          )}
        </div>
      )}

      <Suspense fallback={null}>
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
      </Suspense>

      {/* Модалка выдачи (генерация кода) */}
      {issueAchievement && (
        <div className="fixed inset-0 bg-customblack/60 flex items-center justify-center z-50">
          <div className="bg-customgrey border border-customwhite/10 rounded-xl p-6 w-full max-w-md text-customwhite">
            <h2 className="text-xl font-bold mb-4">
              Выдать ачивку «{issueAchievement.name}»
            </h2>

            {issuing ? (
              <p className="text-customyellow">Генерируем код...</p>
            ) : issueCode ? (
              <div className="space-y-3">
                <p className="text-sm text-customgrey">
                  Код для получения ачивки (сообщите пользователю):
                </p>
                <div className="flex gap-2 items-center">
                  <input
                    readOnly
                    value={issueCode}
                    className="flex-1 bg-customblack border border-customwhite/10 rounded px-3 py-2 font-mono text-customyellow"
                  />
                  <button
                    onClick={copyCode}
                    className="px-3 py-2 bg-customyellow text-customblack rounded hover:brightness-90"
                  >
                    Копировать
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-red-400">Не удалось сгенерировать код</p>
            )}

            <div className="mt-4 flex justify-end">
              <button
                onClick={closeIssueModal}
                className="px-4 py-2 bg-customblack border border-customwhite/10 rounded hover:bg-customwhite/10"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}