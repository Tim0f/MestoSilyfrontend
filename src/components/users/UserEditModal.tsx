// UserEditModal.tsx
// Модалка редактирования пользователя

import React, { useEffect, useState } from 'react';
import { Client } from '../../services/httpClient';
import {
  UsersFrontendService,
  type UpdateUserDto,
} from '../../services/users.service';

interface Props {
  id: string;
  onClose: () => void;
}

const client = Client

const usersService = new UsersFrontendService(client);

export default function UserEditModal({ id, onClose }: Props) {
  const [form, setForm] = useState<UpdateUserDto>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const data: any = await usersService.findOne(id);

      const formattedDOB = data.dateOfBirth
        ? data.dateOfBirth.slice(0, 10)
        : '';

      setForm({
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        dateOfBirth: formattedDOB,
        isActive: data.isActive,
        role: data.role,
      });

      setLoading(false);
    } catch (err: any) {
      setError(err.message ?? 'Ошибка загрузки пользователя');
      setLoading(false);
    }
  };

  const handleChange = (key: keyof UpdateUserDto, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await usersService.update(id, form);
      onClose();
    } catch (err: any) {
      setError(err.message ?? 'Ошибка сохранения пользователя');
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 text-white">
        Загрузка...
      </div>
    );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#111] border border-white/10 p-8 rounded-xl w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-6">Редактировать пользователя</h2>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-gray-300">Имя</label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded bg-[#222] border border-white/10"
              value={form.firstName || ''}
              onChange={(e) => handleChange('firstName', e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Фамилия</label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded bg-[#222] border border-white/10"
              value={form.lastName || ''}
              onChange={(e) => handleChange('lastName', e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Телефон</label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded bg-[#222] border border-white/10"
              value={form.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Дата рождения</label>
            <input
              type="date"
              className="w-full px-3 py-2 rounded bg-[#222] border border-white/10"
              value={form.dateOfBirth || ''}
              onChange={(e) => handleChange('dateOfBirth', e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!form.isActive}
              onChange={(e) => handleChange('isActive', e.target.checked)}
            />
            <label className="text-gray-300">Активен</label>
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Роль</label>
            <select
              className="w-full px-3 py-2 rounded bg-[#222] border border-white/10"
              value={form.role || 'USER'}
              onChange={(e) => handleChange('role', e.target.value as any)}
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
              <option value="ROOT">ROOT</option>
            </select>
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
              Сохранить изменения
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
