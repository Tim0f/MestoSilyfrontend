import React, { useState } from 'react';
import { HttpClient } from '../../services/httpClient';
import {
  TeachersFrontendService,
  type CreateTeacherDto,
} from '../../services/teachers.service';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const client = new HttpClient({
  baseUrl:
    (import.meta.env.VITE_ADMIN_API_URL as string | undefined) ??
    (import.meta.env.VITE_API_URL as string | undefined) ??
    'http://localhost:3000/api',
  getToken: () => localStorage.getItem('token') ?? undefined,
});

const teachersService = new TeachersFrontendService(client);

export default function TeacherCreateModal({ isOpen, onClose }: Props) {
  const [form, setForm] = useState<CreateTeacherDto>({
    firstName: '',
    lastName: '',
    middleName: '',
    phone: '',
    role: '',
    photoUrl: '',
    audioUrl: '',
  });

  const update = (k: keyof CreateTeacherDto, v: any) =>
    setForm((p) => ({ ...p, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await teachersService.create(form);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-[#111] border border-white/10 rounded-xl p-6 w-full max-w-xl text-white max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Создать преподавателя</h2>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-300">Фамилия</label>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => update('lastName', e.target.value)}
              className="w-full bg-[#222] border border-white/10 px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Имя</label>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => update('firstName', e.target.value)}
              className="w-full bg-[#222] border border-white/10 px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Отчество</label>
            <input
              type="text"
              value={form.middleName}
              onChange={(e) => update('middleName', e.target.value)}
              className="w-full bg-[#222] border border-white/10 px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Телефон</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
              className="w-full bg-[#222] border border-white/10 px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Роль</label>
            <input
              type="text"
              value={form.role}
              onChange={(e) => update('role', e.target.value)}
              className="w-full bg-[#222] border border-white/10 px-3 py-2 rounded"
              placeholder="Например: тренер, наставник…"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Фото (URL)</label>
            <input
              type="text"
              value={form.photoUrl}
              onChange={(e) => update('photoUrl', e.target.value)}
              className="w-full bg-[#222] border border-white/10 px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Аудио (URL)</label>
            <input
              type="text"
              value={form.audioUrl}
              onChange={(e) => update('audioUrl', e.target.value)}
              className="w-full bg-[#222] border border-white/10 px-3 py-2 rounded"
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-500 rounded text-black hover:bg-yellow-400"
            >
              Создать
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
