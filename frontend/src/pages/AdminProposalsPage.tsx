// AdminProposalsPage.tsx
import { useEffect, useState, lazy, Suspense } from 'react';
import { Client } from '../services/httpClient';
import {
  ProposalsFrontendService,
  ProposalStatus,
} from '../services/proposal.service';

const ProposalReviewModal = lazy(() => import('../components/proposals/ProposalReviewModal'));

const client = Client;
const proposalsService = new ProposalsFrontendService(client);

const statusLabels: Record<ProposalStatus, string> = {
  [ProposalStatus.PENDING]: 'На рассмотрении',
  [ProposalStatus.APPROVED]: 'Одобрена',
  [ProposalStatus.REJECTED]: 'Отклонена',
};

const statusColors: Record<ProposalStatus, string> = {
  [ProposalStatus.PENDING]: 'bg-yellow-600 text-black',
  [ProposalStatus.APPROVED]: 'bg-green-600 text-white',
  [ProposalStatus.REJECTED]: 'bg-red-600 text-white',
};

export default function AdminProposalsPage() {
  const [proposals, setProposals] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState<ProposalStatus | ''>('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Загрузка списка заявок при изменении фильтра
  useEffect(() => {
    loadProposals();
  }, [filterStatus]);

  // Получение ID текущего пользователя при монтировании компонента
  useEffect(() => {
    fetchCurrentUserId();
  }, []);

  async function fetchCurrentUserId() {
    try {
      const user = await getCurrentUser();
      if (user?.id) {
        setCurrentUserId(user.id);
      }
    } catch (err) {
      console.error('Не удалось определить текущего пользователя', err);
      // если не удалось получить, считаем, что пользователь неавторизован
    }
  }

  async function loadProposals() {
    try {
      const statusParam = filterStatus || undefined;
      const data = await proposalsService.findAll<any[]>(statusParam);
      setProposals(data);
    } catch (err) {
      console.error('Ошибка загрузки заявок', err);
    }
  }

  function handleCloseModal() {
    setSelectedId(null);
    loadProposals();
  }

  // Проверка, является ли заявка собственной для текущего пользователя
  const isOwnProposal = (proposal: any): boolean => {
    return currentUserId !== null && proposal.user?.id === currentUserId;
  };

  return (
    <div className="p-10 text-customwhite space-y-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Заявки на секции / мероприятия</h1>

        <div className="flex gap-4">
          <select
            className="px-3 py-2 rounded bg-customblack border border-customwhite/10 text-customwhite"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as ProposalStatus | '')}
          >
            <option value="">Все статусы</option>
            <option value={ProposalStatus.PENDING}>На рассмотрении</option>
            <option value={ProposalStatus.APPROVED}>Одобренные</option>
            <option value={ProposalStatus.REJECTED}>Отклонённые</option>
          </select>
        </div>
      </div>

      {/* Таблица заявок */}
      <div className="overflow-x-auto bg-customgrey rounded-lg border border-customwhite/10">
        <table className="min-w-full text-sm">
          <thead className="border-b border-customwhite/10 text-customwhite/70">
            <tr>
              <th className="text-left p-3">Название</th>
              <th className="text-left p-3">Тип</th>
              <th className="text-left p-3">Автор</th>
              <th className="text-left p-3">Статус</th>
              <th className="text-left p-3">Дата подачи</th>
              <th className="text-left p-3">Действия</th>
            </tr>
          </thead>
          <tbody>
            {proposals.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-customwhite/50">
                  Заявок нет
                </td>
              </tr>
            ) : (
              proposals.map((p) => {
                const own = isOwnProposal(p);
                return (
                  <tr key={p.id} className="border-b border-customwhite/5 hover:bg-white/5">
                    <td className="p-3">{p.title}</td>
                    <td className="p-3">
                      {p.type === 'SECTION' ? 'Секция' : 'Мероприятие'}
                    </td>
                    <td className="p-3">
                      {p.user?.firstName} {p.user?.lastName}
                      {own && (
                        <span className="ml-2 text-xs text-yellow-400">(вы)</span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[p.status as ProposalStatus]}`}>
                        {statusLabels[p.status as ProposalStatus]}
                      </span>
                    </td>
                    <td className="p-3">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      {own ? (
                        <span className="text-customwhite/40 text-xs">
                          Нельзя рассмотреть свою заявку
                        </span>
                      ) : (
                        <button
                          onClick={() => setSelectedId(p.id)}
                          className="px-3 py-1 bg-customyellow text-customblack rounded font-semibold hover:bg-yellow-500"
                        >
                          Рассмотреть
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <Suspense fallback={null}>
        {selectedId && (
          <ProposalReviewModal
            id={selectedId}
            onClose={handleCloseModal}
          />
        )}
      </Suspense>
    </div>
  );
}

// ===================== Вспомогательная функция для получения текущего пользователя =====================

interface CurrentUser {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
}

/**
 * Возвращает данные текущего авторизованного пользователя.
 * Если в вашем приложении информация хранится в localStorage,
 * можно просто прочитать её оттуда, например:
 *
 *   const stored = localStorage.getItem('user');
 *   return stored ? JSON.parse(stored) : null;
 *
 * Здесь показан вариант с запросом к API.
 */
async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    // Замените '/auth/me' на актуальный эндпоинт вашего бэкенда
    const response = await client.get<CurrentUser>('/auth/me');
    return response;
  } catch {
    // Если запрос не удался, возвращаем null
    return null;
  }
}