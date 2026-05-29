import React, { useState } from 'react';
import { Client } from '../../services/httpClient';
import {
  PartnersFrontendService,
  type CreatePartnerDto,
} from '../../services/partners.service';
import { UploadFrontendService } from '../../services/upload.service';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const client = Client;
const partnersService = new PartnersFrontendService(client);
const uploadService = new UploadFrontendService(client);

export default function PartnerCreateModal({ isOpen, onClose }: Props) {
  const [form, setForm] = useState<CreatePartnerDto>({
    name: '',
    imageUrl: '',
    link: '',
  });

  const [preview, setPreview] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);

  const update = (key: keyof CreatePartnerDto, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

const submit = async (e: React.FormEvent) => {
  e.preventDefault();

  let imageUrl = form.imageUrl.trim();

  if (file) {
    const {filename} = await uploadService.image(file);
    imageUrl = filename;
  }

  await partnersService.create({
    name: form.name.trim(),
    imageUrl,
    link: form.link.trim(),
  });

  onClose();
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-customgrey border border-white/10 rounded-xl p-6 w-full max-w-lg text-white">
        <h2 className="text-xl font-bold mb-4">Создать партнёра</h2>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block mb-1 text-customwhite">Название</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              required
              className="w-full bg-[#222] border border-white/10 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 text-customwhite">Изображение</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="w-full bg-[#222] border border-white/10 rounded px-3 py-2"
            />

            {preview && (
              <img
                src={preview}
                alt="preview"
                className="mt-2 max-h-40 rounded border border-white/10"
              />
            )}
          </div>

          <div>
            <label className="block mb-1 text-customwhite">Ссылка</label>
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
              className="px-4 py-2 bg-customyellow text-black rounded hover:bg-customyellow"
            >
              Создать
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}