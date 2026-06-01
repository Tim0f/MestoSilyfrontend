// components/proposals/ProposalReviewModal.tsx
import { useEffect, useState } from 'react';
import { Client } from '../../services/httpClient';
import {
  ProposalsFrontendService,
  ProposalStatus,
} from '../../services/proposal.service';

const client = Client;
const proposalsService = new ProposalsFrontendService(client);

interface Props {
  id: string;
  onClose: () => void;
}

export default function ProposalReviewModal({ id, onClose }: Props) {
  const [proposal, setProposal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // для reject
  const [reviewComment, setReviewComment] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (id) {
      loadProposal();
    }
  }, [id]);

  async function loadProposal() {
    try {
      setLoading(true);
      const data = await proposalsService.findOne<any>(id);
      setProposal(data);
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove() {
    if (actionLoading) return;
    setActionLoading(true);
    try {
      await proposalsService.approve(id);
      onClose(); // закроется и обновит список снаружи
    } catch (err: any) {
      setError(err.message || 'Ошибка одобрения');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleReject() {
    if (actionLoading) return;
    if (!reviewComment.trim()) {
      setError('Укажите причину отклонения');
      return;
    }
    setActionLoading(true);
    try {
      await proposalsService.reject(id, { reviewComment });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Ошибка отклонения');
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-customblack/60 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-customgrey p-6 rounded text-customwhite">Загрузка...</div>
      </div>
    );
  }

  if (error && !proposal) {
    return (
      <div className="fixed inset-0 bg-customblack/60 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-customgrey p-6 rounded text-customwhite">
          <p className="text-[#FF6B4A]">{error}</p>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-customgrey rounded">
            Закрыть
          </button>
        </div>
      </div>
    );
  }

  if (!proposal) return null;

  const isPending = proposal.status === ProposalStatus.PENDING;

  return (
    <div className="fixed inset-0 bg-customblack/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-customgrey border border-customwhite/10 p-8 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-customwhite">Рассмотрение заявки</h2>

        {error && <p className="text-[#FF6B4A] mb-4">{error}</p>}

        <div className="space-y-4 text-customwhite">
          <div>
            <span className="text-customwhite/70">Название:</span>
            <p className="font-semibold">{proposal.title}</p>
          </div>

          <div>
            <span className="text-customwhite/70">Тип:</span>
            <p>{proposal.type === 'SECTION' ? 'Секция' : 'Мероприятие'}</p>
          </div>

          <div>
            <span className="text-customwhite/70">Автор:</span>
            <p>
              {proposal.user?.firstName} {proposal.user?.lastName} ({proposal.user?.email})
            </p>
          </div>

          <div>
            <span className="text-customwhite/70">Хочет быть ведущим:</span>
            <p>{proposal.wantsToLead ? 'Да' : 'Нет'}</p>
          </div>

          <div>
            <span className="text-customwhite/70">Описание:</span>
            <p className="whitespace-pre-wrap">{proposal.description}</p>
          </div>

          <div>
            <span className="text-customwhite/70">Статус:</span>
            <p className="font-semibold">
              {proposal.status === ProposalStatus.PENDING
                ? 'На рассмотрении'
                : proposal.status === ProposalStatus.APPROVED
                ? 'Одобрена'
                : 'Отклонена'}
            </p>
          </div>

          {proposal.reviewComment && (
            <div>
              <span className="text-customwhite/70">Комментарий администратора:</span>
              <p className="italic">{proposal.reviewComment}</p>
            </div>
          )}

          {proposal.reviewedBy && (
            <div>
              <span className="text-customwhite/70">Рассмотрена администратором:</span>
              <p>
                {proposal.reviewedBy.firstName} {proposal.reviewedBy.lastName}
              </p>
            </div>
          )}
        </div>

        {/* Действия доступны только если статус PENDING */}
        {isPending && (
          <div className="mt-8 border-t border-customwhite/10 pt-6 space-y-4">
            <h3 className="font-semibold text-customwhite">Принять решение</h3>

            {/* Кнопка одобрения */}
            <div className="flex gap-4">
              <button
                onClick={handleApprove}
                disabled={actionLoading}
                className="px-5 py-2 bg-green-600 text-white rounded font-semibold hover:bg-green-500 disabled:opacity-60"
              >
                {actionLoading ? 'Обработка...' : 'Одобрить'}
              </button>

              <button
                onClick={handleReject}
                disabled={actionLoading}
                className="px-5 py-2 bg-red-600 text-white rounded font-semibold hover:bg-red-500 disabled:opacity-60"
              >
                {actionLoading ? 'Обработка...' : 'Отклонить'}
              </button>
            </div>

            {/* Поле для комментария при отклонении */}
            <div>
              <label className="block mb-1 text-customwhite text-sm">
                Причина отклонения (обязательно)
              </label>
              <textarea
                className="w-full px-3 py-2 rounded bg-customblack border border-customwhite/10 text-customwhite"
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Поясните причину..."
              />
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-customgrey rounded hover:bg-customgrey text-customwhite"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}