import React, { useEffect, useState } from "react";
import { Client } from "../../services/httpClient";
import {
  LessonsFrontendService,
  type UpdateLessonDto,
} from "../../services/lessons.service";
import { SectionsFrontendService } from "../../services/sections.service";
import { TeachersFrontendService } from "../../services/teachers.service";

interface Props {
  id: string;
  onClose: () => void;
}

const client = Client;

const lessonsService = new LessonsFrontendService(client);
const sectionsService = new SectionsFrontendService(client);
const teachersService = new TeachersFrontendService(client);

export default function LessonEditModal({ id, onClose }: Props) {
  const [form, setForm] = useState<UpdateLessonDto>({});
  const [sections, setSections] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const lesson: any = await lessonsService.findOne(id);
      const s = await sectionsService.findAll();
      const t = await teachersService.findAll();

      setSections(Array.isArray(s) ? s : []);
      setTeachers(Array.isArray(t) ? t : []);

      setForm({
        sectionId: lesson.sectionId ?? "",
        teacherId: lesson.teacherId ?? "",
        date: lesson.date ?? "",
        startsAt: lesson.startsAt ?? "",
        endsAt: lesson.endsAt ?? "",
        location: lesson.location ?? "",
        capacity: lesson.capacity ?? 0,
        description: lesson.description ?? "",
      });

      setLoading(false);
    } catch (err: any) {
      setError(err.message ?? "Ошибка загрузки урока");
      setLoading(false);
    }
  };

  const handleChange = (key: keyof UpdateLessonDto, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await lessonsService.update(id, form);
      onClose();
    } catch (err: any) {
      setError(err.message ?? "Ошибка сохранения урока");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center text-white z-50">
        Загрузка...
      </div>
    );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-customgrey border border-white/10 p-8 rounded-xl w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-6">Редактировать урок</h2>

        {error && <p className="text-[#FF6B4A] mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Секция */}
          <div>
            <label className="block mb-1 text-customwhite">Секция</label>
            <select
              className="w-full px-3 py-2 rounded bg-[#222] border border-white/10"
              value={form.sectionId}
              onChange={(e) => handleChange("sectionId", e.target.value)}
            >
              <option value="">Не выбрано</option>
              {sections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Учитель */}
          <div>
            <label className="block mb-1 text-customwhite">Учитель</label>
            <select
              className="w-full px-3 py-2 rounded bg-[#222] border border-white/10"
              value={form.teacherId}
              onChange={(e) => handleChange("teacherId", e.target.value)}
            >
              <option value="">Не выбрано</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.firstName} {t.lastName}
                </option>
              ))}
            </select>
          </div>

          {/* Дата */}
          <div>
            <label className="block mb-1 text-customwhite">Дата</label>
            <input
              type="date"
              className="w-full px-3 py-2 rounded bg-[#222] border border-white/10"
              value={form.date}
              onChange={(e) => handleChange("date", e.target.value)}
            />
          </div>

          {/* Начало */}
          <div>
            <label className="block mb-1 text-customwhite">Начало</label>
            <input
              type="time"
              className="w-full px-3 py-2 rounded bg-[#222] border border-white/10"
              value={form.startsAt}
              onChange={(e) => handleChange("startsAt", e.target.value)}
            />
          </div>

          {/* Окончание */}
          <div>
            <label className="block mb-1 text-customwhite">Окончание</label>
            <input
              type="time"
              className="w-full px-3 py-2 rounded bg-[#222] border border-white/10"
              value={form.endsAt}
              onChange={(e) => handleChange("endsAt", e.target.value)}
            />
          </div>

          {/* Локация */}
          <div>
            <label className="block mb-1 text-customwhite">Локация</label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded bg-[#222] border border-white/10"
              value={form.location}
              onChange={(e) => handleChange("location", e.target.value)}
            />
          </div>

          {/* Вместимость */}
          <div>
            <label className="block mb-1 text-customwhite">Вместимость</label>
            <input
              type="number"
              className="w-full px-3 py-2 rounded bg-[#222] border border-white/10"
              value={form.capacity}
              onChange={(e) => handleChange("capacity", Number(e.target.value))}
            />
          </div>

          {/* Описание */}
          <div>
            <label className="block mb-1 text-customwhite">Описание</label>
            <textarea
              className="w-full px-3 py-2 rounded bg-[#222] border border-white/10 min-h-[100px] resize-none"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Описание занятия (необязательно)"
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
              className="px-4 py-2 bg-customyellow text-black rounded font-semibold hover:bg-customyellow disabled:opacity-60"
            >
              Сохранить изменения
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
