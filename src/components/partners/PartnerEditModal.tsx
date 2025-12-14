import React, { useState } from 'react';
import { Client } from '../../services/httpClient';
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

const client = Client;
const partnersService = new PartnersFrontendService(client);

export default function PartnerEditModal({ isOpen, onClose, partner }: Props) {
  const [form, setForm] = useState<UpdatePartnerDto>({
    name: partner.name,
    imageUrl: partner.imageUrl,
    link: partner.link,
  });

  const [preview, setPreview] = useState<string>(partner.imageUrl || '');

  const update = (k: keyof UpdatePartnerDto, v: any) =>
    setForm((prev) => ({ ...prev, [k]: v }));

const onFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const f = e.target.files?.[0];
  if (!f) return;

  setPreview(URL.createObjectURL(f));

  const formData = new FormData();
  formData.append('image', f);

  const uploaded = await partnersService.uploadTempImage(formData);
  update('imageUrl', uploaded.url);
};


  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    await partnersService.update(partner.id, form);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-customgrey border border-white/10 rounded-xl p-6 w-full max-w-lg text-white">
        <h2 className="text-xl font-bold mb-4">Изменить партнёра</h2>

        <form onSubmit={save} className="space-y-4">
          <div>
            <label className="block mb-1 text-customwhite">Название</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              className="w-full bg-[#222] border border-white/10 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 text-customwhite">Изображение</label>

            {preview && (
              <img
                src={preview}
                alt="preview"
                className="w-32 h-32 object-cover rounded mb-2 border border-white/10"
              />
            )}

            <input
              type="file"
              accept="image/*"
              onChange={onFileSelect}
              className="w-full bg-[#222] border border-white/10 rounded px-3 py-2 mb-2"
            />

            <input
              type="text"
              value={form.imageUrl}
              onChange={(e) => update('imageUrl', e.target.value)}
              className="w-full bg-[#222] border border-white/10 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 text-customwhite">Ссылка</label>
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
              className="px-4 py-2 bg-customyellow text-black rounded hover:bg-customyellow"
            >
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}