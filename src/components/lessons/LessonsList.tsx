import { useEffect, useState } from 'react';
import { Client } from '../../services/httpClient';
import { LessonsFrontendService } from '../../services/lessons.service';

interface LessonItem {
  id: string;
  date?: string;
  startsAt?: string;
  endsAt?: string;
  location?: string;
  capacity?: number;
  description?: string;

  section?: {
    id: string;
    name: string;
  } | null;

  teacher?: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
}

interface Props {
  onEdit: (id: string) => void;
  sectionId?: string; // findAll(sectionId?) поддерживается сервисом
}

const client = Client;
const lessonsService = new LessonsFrontendService(client);

export default function LessonsList({ onEdit, sectionId }: Props) {
  const [lessons, setLessons] = useState<LessonItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLessons();
  }, [sectionId]);

  const loadLessons = async () => {
    try {
      setLoading(true);

      const res: any = await lessonsService.findAll(sectionId);

      const list = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
        ? res.data
        : [];

      setLessons(list);
    } catch (err: any) {
      setError(err.message ?? 'Ошибка загрузки уроков');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить урок?')) return;

    try {
      await lessonsService.remove(id);
      loadLessons();
    } catch (err: any) {
      alert(err.message ?? 'Ошибка удаления урока');
    }
  };

  if (loading) return <p className="text-customwhite">Загрузка...</p>;
  if (error) return <p className="text-[#FF6B4A]">{error}</p>;

  return (
    <div className="bg-customgrey border border-white/10 rounded-xl divide-y divide-white/5">
      {lessons.map((lesson) => (
        <div
          key={lesson.id}
          className="p-4 flex items-center justify-between hover:bg-white/5"
        >
          <div className="space-y-1">
            {/* Секция */}
            <p className="text-white text-medium">
              Секция: {lesson.section?.name ?? '—'}
            </p>

            {/* Учитель */}
            <p className="text-gray-400 text-sm">
              Учитель:{' '}
              {lesson.teacher
                ? `${lesson.teacher.lastName} ${lesson.teacher.firstName}`
                : 'Не назначен'}
            </p>

            {/* Дата */}
            {lesson.date && (
              <p className="text-gray-400 text-sm">Дата: {lesson.date}</p>
            )}

            {/* Время */}
            {(lesson.startsAt || lesson.endsAt) && (
              <p className="text-gray-400 text-sm">
                {lesson.startsAt ?? '—'} — {lesson.endsAt ?? '—'}
              </p>
            )}

            {/* Локация */}
            {lesson.location && (
              <p className="text-gray-500 text-sm">
                Локация: {lesson.location}
              </p>
            )}

            {/* Вместимость */}
            {lesson.capacity !== undefined && (
              <p className="text-gray-500 text-sm">
                Вместимость: {lesson.capacity}
              </p>
            )}

            {/* Описание */}
            {lesson.description && (
              <p className="text-gray-500 text-sm whitespace-pre-line">
                Описание: {lesson.description}
              </p>
            )}
          </div>

          <div className="flex gap-4 min-w-[140px] justify-end">
            <button
              onClick={() => onEdit(lesson.id)}
              className="text-customyellow hover:text-customyellow"
            >
              Редактировать
            </button>

            <button
              onClick={() => handleDelete(lesson.id)}
              className="text-[#FF6B4A] hover:text-red-300"
            >
              Удалить
            </button>
          </div>
        </div>
      ))}

      {!lessons.length && (
        <p className="text-gray-400 p-4 text-center">Уроков нет</p>
      )}
    </div>
  );
}
