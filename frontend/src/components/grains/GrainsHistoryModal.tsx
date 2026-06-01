import { useEffect, useState } from 'react';
import { GrainsFrontendService } from '../../services/grains.service';
import { Client } from '../../services/httpClient';

const client = Client

const grainsService = new GrainsFrontendService(client);

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export default function GrainsHistoryModal({ isOpen, onClose, userId }: Props) {
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const res: any = await grainsService.history(userId);
      const data = res?.data ?? res;

      setTotal(data.total);
      setHistory(Array.isArray(data.history) ? data.history : []);
    } catch (e) {
      console.error('Ошибка загрузки истории', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && userId) {
      loadHistory();
    }
  }, [isOpen, userId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-customblack/60 flex items-center justify-center z-50">
      <div className="bg-customgrey p-6 rounded-xl w-full max-w-xl max-h-[80vh] overflow-y-auto border border-customwhite/10 text-customwhite">
        <h2 className="text-xl font-bold mb-4">История операций</h2>

        <p className="mb-3 text-customwhite">Всего зерен: {total}</p>

        {loading && <p>Загрузка...</p>}

        {!loading && history.length === 0 && <p className="text-customgrey">Нет данных</p>}

        <div className="space-y-3">
          {history.map((h) => (
            <div
              key={h.id}
              className="border border-customwhite/10 p-3 rounded bg-customblack"
            >
              <div className="font-semibold">
                {h.amount > 0 ? '+' : ''}
                {h.amount} зерен
              </div>
              <div className="text-gray-400">{h.reason}</div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(h.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        <button
          className="mt-6 px-4 py-2 bg-customgrey rounded hover:bg-customgrey"
          onClick={onClose}
        >
          Закрыть
        </button>
      </div>
    </div>
  );
}
