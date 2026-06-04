// SectionsList.tsx
// Компонент списка секций с поддержкой удаления и редактирования

import { useEffect, useState } from 'react';
import { Client } from '../../services/httpClient';
import { SectionsFrontendService } from '../../services/sections.service';

const client = Client

const sectionsService = new SectionsFrontendService(client);

interface Props {
  onEdit: (id: string) => void;
}

export default function SectionsList({ onEdit }: Props) {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    try {
      setLoading(true);
      const response: any = await sectionsService.findAll();
      const list = Array.isArray(response) ? response : response?.data || [];
      setSections(list);
    } catch (err: any) {
      setError(err.message ?? 'Ошибка загрузки секций');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить секцию?')) return;
    try {
      await sectionsService.remove(id);
      loadSections();
    } catch (err: any) {
      alert(err.message ?? 'Ошибка удаления');
    }
  };

  if (loading) return <p className="text-customwhite">Загрузка...</p>;
  if (error) return <p className="text-[#FF6B4A]">{error}</p>;

  return (
    <div className="bg-customgrey border border-customwhite/10 rounded-xl divide-y divide-customwhite/5">
      {sections.map((s) => (
        <div key={s.id} className="p-4 flex items-center justify-between hover:bg-customwhite/5">
          <div>
            <p className="text-lg font-medium">{s.name}</p>
            <p className="text-customwhite text-sm">Возраст: {s.ageMin}–{s.ageMax}</p>
            <p className="text-customwhite text-sm">Максимум участников: {s.maxParticipants}</p>
            <p className="text-customwhite text-sm">Активна: {s.isActive ? 'Да' : 'Нет'}</p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => onEdit(s.id)}
              className="text-customyellow hover:text-customyellow"
            >
              Редактировать
            </button>

            <button
              onClick={() => handleDelete(s.id)}
              className="text-[#FF6B4A] hover:text-red-300"
            >
              Удалить
            </button>
          </div>
        </div>
      ))}

      {!sections.length && (
        <p className="text-customgrey p-4 text-center">Секций нет</p>
      )}
    </div>
  );
}
