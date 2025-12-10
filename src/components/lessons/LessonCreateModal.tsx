import React, { useEffect, useState } from 'react';
import { Client } from '../../services/httpClient';
import {
  LessonsFrontendService,
  type CreateLessonDto,
} from '../../services/lessons.service';
import { SectionsFrontendService } from '../../services/sections.service';
import { TeachersFrontendService } from '../../services/teachers.service';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const client = Client;

const lessonsService = new LessonsFrontendService(client);
const sectionsService = new SectionsFrontendService(client);
const teachersService = new TeachersFrontendService(client);

export default function LessonCreateModal({ isOpen, onClose }: Props) {
  const [form, setForm] = useState<CreateLessonDto>({
    sectionId: '',
    teacherId: '',
    date: '',
    startsAt: '',
    endsAt: '',
    location: '',
    capacity: 0,
  });

  const [sections, setSections] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) loadData();
  }, [isOpen]);

  const loadData = async () => {
    try {
      const s = await sectionsService.findAll();
      const t = await teachersService.findAll();
      setSections(Array.isArray(s) ? s : []);
      setTeachers(Array.isArray(t) ? t : []);
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  const handleChange = (key: keyof CreateLessonDto, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await lessonsService.create(form);
      onClose();
    } catch (err: any) {
      setError(err.message ?? 'Ошибка создания урока');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#111] border border-white/10 p-8 rounded-xl w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-6">Создать урок</h2>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Секция */}
          <div>
            <label className="block mb-1 text-gray-300">Секция</label>
            <select
              className="w-full px-3 py-2 rounded bg-[#222] border border-white/10"
              value={form.sectionId}
              onChange={(e) => handleChange('sectionId', e.target.value)}
              required
            >
              <option value="">Выберите секцию</option>
              {sections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Учитель */}
          <div>
            <label className="block mb-1 text-gray-300">Учитель</label>
            <select
              className="w-full px-3 py-2 rounded bg-[#222] border border-white/10"
              value={form.teacherId}
              onChange={(e) => handleChange('teacherId', e.target.value)}
              required
            >
              <option value="">Выберите учителя</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.firstName} {t.lastName}
                </option>
              ))}
            </select>
          </div>

          {/* Дата */}
          <div>
            <label className="block mb-1 text-gray-300">Дата</label>
            <input
              type="date"
              className="w-full px-3 py-2 rounded bg-[#222] border border-white/10"
              value={form.date}
              onChange={(e) => handleChange('date', e.target.value)}
              required
            />
          </div>

          {/* Время начала */}
          <div>
            <label className="block mb-1 text-gray-300">Начало</label>
            <input
              type="time"
              className="w-full px-3 py-2 rounded bg-[#222] border border-white/10"
              value={form.startsAt}
              onChange={(e) => handleChange('startsAt', e.target.value)}
              required
            />
          </div>

          {/* Время окончания */}
          <div>
            <label className="block mb-1 text-gray-300">Окончание</label>
            <input
              type="time"
              className="w-full px-3 py-2 rounded bg-[#222] border border-white/10"
              value={form.endsAt}
              onChange={(e) => handleChange('endsAt', e.target.value)}
              required
            />
          </div>

          {/* Локация */}
          <div>
            <label className="block mb-1 text-gray-300">Локация</label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded bg-[#222] border border-white/10"
              value={form.location}
              onChange={(e) => handleChange('location', e.target.value)}
              required
            />
          </div>

          {/* Вместимость */}
          <div>
            <label className="block mb-1 text-gray-300">Вместимость</label>
            <input
              type="number"
              className="w-full px-3 py-2 rounded bg-[#222] border border-white/10"
              value={form.capacity}
              onChange={(e) => handleChange('capacity', Number(e.target.value))}
              required
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
            >
              Отмена
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-yellow-500 text-black rounded font-semibold hover:bg-yellow-400 disabled:opacity-60"
            >
              {loading ? 'Создание...' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
