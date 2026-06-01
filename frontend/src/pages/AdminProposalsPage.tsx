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

  useEffect(() => {
    loadProposals();
  }, [filterStatus]);

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
    loadProposals(); // обновим список после изменения статуса
  }

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
              proposals.map((p) => (
                <tr key={p.id} className="border-b border-customwhite/5 hover:bg-customwhite/5">
                  <td className="p-3">{p.title}</td>
                  <td className="p-3">
                    {p.type === 'SECTION' ? 'Секция' : 'Мероприятие'}
                  </td>
                  <td className="p-3">
                    {p.user?.firstName} {p.user?.lastName}
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
                    <button
                      onClick={() => setSelectedId(p.id)}
                      className="px-3 py-1 bg-customyellow text-customblack rounded font-semibold hover:bg-yellow-500"
                    >
                      Рассмотреть
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Модалка рассмотрения */}
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