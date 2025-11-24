import React, { useState } from 'react';
import { HttpClient } from '../../services/httpClient';
import {
  PartnersFrontendService,
  type CreatePartnerDto,
} from '../../services/partners.service';

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

const partnersService = new PartnersFrontendService(client);

export default function PartnerCreateModal({ isOpen, onClose }: Props) {
  const [form, setForm] = useState<CreatePartnerDto>({
    name: '',
    imageUrl: '',
    link: '',
  });

  const update = (key: keyof CreatePartnerDto, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await partnersService.create({
      name: form.name.trim(),
      imageUrl: form.imageUrl.trim(),
      link: form.link.trim(),
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#111] border border-white/10 rounded-xl p-6 w-full max-w-lg text-white">
        <h2 className="text-xl font-bold mb-4">Создать партнёра</h2>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-300">Название</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              required
              className="w-full bg-[#222] border border-white/10 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">URL изображения</label>
            <input
              type="text"
              value={form.imageUrl}
              onChange={(e) => update('imageUrl', e.target.value)}
              required
              className="w-full bg-[#222] border border-white/10 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Ссылка</label>
            <input
              type="text"
              value={form.link}
              onChange={(e) => update('link', e.target.value)}
              required
              className="w-full bg-[#222] border border-white/10 rounded px-3 py-2"
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
            >
              Отмена
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-400"
            >
              Создать
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
