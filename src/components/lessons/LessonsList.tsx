// LessonsList.tsx
// Список уроков с поддержкой редактирования и удаления

import React, { useEffect, useState } from 'react';
import { Client } from '../../services/httpClient';
import { LessonsFrontendService } from '../../services/lessons.service';

interface LessonItem {
  id: string;
  dayOfWeek: number;
  startsAt: string;
  endsAt: string;
  location: string;
  capacity: number;

  section: {
    id: string;
    name: string;
  };

  teacher: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
}

interface Props {
  onEdit: (id: string) => void;
}

const client = Client;
const lessonsService = new LessonsFrontendService(client);

export default function LessonsList({ onEdit }: Props) {
  const [lessons, setLessons] = useState<LessonItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLessons();
  }, []);

  const loadLessons = async () => {
    try {
      setLoading(true);
      const res: any = await lessonsService.findAll();
      const list = Array.isArray(res) ? res : res?.data || [];
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
      alert(err.message ?? 'Ошибка удаления');
    }
  };

  const dayNames: Record<number, string> = {
    1: 'Понедельник',
    2: 'Вторник',
    3: 'Среда',
    4: 'Четверг',
    5: 'Пятница',
    6: 'Суббота',
    7: 'Воскресенье',
  };

  if (loading)
    return <p className="text-gray-300">Загрузка...</p>;

  if (error)
    return <p className="text-red-400">{error}</p>;

  return (
    <div className="bg-[#111] border border-white/10 rounded-xl divide-y divide-white/5">
      {lessons.map((lesson) => (
        <div
          key={lesson.id}
          className="p-4 flex items-center justify-between hover:bg-white/5"
        >
          <div>
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

            {/* День недели */}
            <p className="text-gray-400 text-sm">
              День недели: {dayNames[lesson.dayOfWeek] ?? lesson.dayOfWeek}
            </p>

            {/* Время */}
            <p className="text-gray-400 text-sm">
              {lesson.startsAt} — {lesson.endsAt}
            </p>

            {/* Локация */}
            {lesson.location && (
              <p className="text-gray-500 text-sm">
                Локация: {lesson.location}
              </p>
            )}

            {/* Вместимость */}
            <p className="text-gray-500 text-sm">
              Вместимость: {lesson.capacity}
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => onEdit(lesson.id)}
              className="text-yellow-400 hover:text-yellow-300"
            >
              Редактировать
            </button>

            <button
              onClick={() => handleDelete(lesson.id)}
              className="text-red-400 hover:text-red-300"
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
