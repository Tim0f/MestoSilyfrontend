import React, { useState } from 'react';
import { HttpClient } from '../../services/httpClient';
import {
  PartnersFrontendService,
  type UpdatePartnerDto,
} from '../../services/partners.service';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  partner: {
    id: string;
    name: string;
    imageUrl: string;
    link: string;
  };
}

const client = new HttpClient({
  baseUrl:
    (import.meta.env.VITE_ADMIN_API_URL as string | undefined) ??
    (import.meta.env.VITE_API_URL as string | undefined) ??
    'http://localhost:3000/api',
  getToken: () => localStorage.getItem('token') ?? undefined,
});

const partnersService = new PartnersFrontendService(client);

export default function PartnerEditModal({ isOpen, onClose, partner }: Props) {
  const [form, setForm] = useState<UpdatePartnerDto>({
    name: partner.name,
    imageUrl: partner.imageUrl,
    link: partner.link,
  });

  const update = (k: keyof UpdatePartnerDto, v: any) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    await partnersService.update(partner.id, form);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#111] border border-white/10 rounded-xl p-6 w-full max-w-lg text-white">
        <h2 className="text-xl font-bold mb-4">Изменить партнёра</h2>

        <form onSubmit={save} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-300">Название</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              className="w-full bg-[#222] border border-white/10 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">URL изображения</label>
            <input
              type="text"
              value={form.imageUrl}
              onChange={(e) => update('imageUrl', e.target.value)}
              className="w-full bg-[#222] border border-white/10 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Ссылка</label>
            <input
              type="text"
              value={form.link}
              onChange={(e) => update('link', e.target.value)}
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
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
