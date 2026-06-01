// AdminCreateModal.tsx
// Модалка создания администратора

import React, { useState } from 'react';
import { Client } from '../../services/httpClient';
import {
  UsersFrontendService,
  type CreateAdminDto,
} from '../../services/users.service';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const client = Client

const usersService = new UsersFrontendService(client);

export default function AdminCreateModal({ isOpen, onClose }: Props) {
  const [form, setForm] = useState<CreateAdminDto>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChange = (key: keyof CreateAdminDto, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await usersService.createAdmin(form);
      onClose();
    } catch (err: any) {
      setError(err.message ?? 'Ошибка создания администратора');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-customblack/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-customgrey border border-customwhite/10 p-8 rounded-xl w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-6">Создать администратора</h2>

        {error && <p className="text-[#FF6B4A] mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-customwhite">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 rounded bg-customblack border border-customwhite/10"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-customwhite">Пароль</label>
            <input
              type="password"
              className="w-full px-3 py-2 rounded bg-customblack border border-customwhite/10"
              value={form.password}
              onChange={(e) => handleChange('password', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-customwhite">Имя</label>
              <input
                type="text"
                className="w-full px-3 py-2 rounded bg-customblack border border-customwhite/10"
                value={form.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-customwhite">Фамилия</label>
              <input
                type="text"
                className="w-full px-3 py-2 rounded bg-customblack border border-customwhite/10"
                value={form.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-customwhite">Телефон</label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded bg-customblack border border-customwhite/10"
              value={form.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-customgrey rounded hover:bg-customgrey"
            >
              Отмена
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-customyellow text-customblack rounded font-semibold hover:bg-customyellow disabled:opacity-60"
            >
              {loading ? 'Создание...' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}