import React, { useState, useEffect } from 'react';
import { Client } from '../../services/httpClient';
import {
  PartnersFrontendService,
  type UpdatePartnerDto,
} from '../../services/partners.service';
import { UploadFrontendService } from '../../services/upload.service';
import { getPublicUrl } from '../../utils/publicUrl';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  partner: {
    id: string;
    name: string;
    imageUrl: string; // теперь ожидаем, что здесь уже полный URL (с https://...)
    link: string;
  };
}

const client = Client;
const partnersService = new PartnersFrontendService(client);
const uploadService = new UploadFrontendService(client);

export default function PartnerEditModal({ isOpen, onClose, partner }: Props) {
  const [name, setName] = useState(partner.name);
  const [link, setLink] = useState(partner.link);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(partner.imageUrl || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Сбрасываем состояние при открытии
  useEffect(() => {
    if (isOpen) {
      setName(partner.name);
      setLink(partner.link);
      setFile(null);
      setPreview(partner.imageUrl || '');
      setError(null);
    }
  }, [isOpen, partner]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setError(null);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let imageUrl = partner.imageUrl; // по умолчанию оставляем старый

      if (file) {
        const { filename } = await uploadService.image(file);
        imageUrl = getPublicUrl(filename);
      }

      const payload: UpdatePartnerDto = {
        name: name.trim(),
        imageUrl,
        link: link.trim(),
      };

      await partnersService.update(partner.id, payload);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Ошибка при обновлении партнёра');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-customblack/60 flex items-center justify-center z-50">
      <div className="bg-customgrey border border-customwhite/10 rounded-xl p-6 w-full max-w-lg text-customwhite">
        <h2 className="text-xl font-bold mb-4">Изменить партнёра</h2>

        <form onSubmit={save} className="space-y-4">
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 rounded px-3 py-2 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block mb-1 text-customwhite">Название</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-[#222] border border-customwhite/10 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 text-customwhite">Изображение</label>
            {preview && (
              <img
                src={preview}
                alt="preview"
                className="w-32 h-32 object-cover rounded mb-2 border border-customwhite/10"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="w-full bg-[#222] border border-customwhite/10 rounded px-3 py-2"
            />
            <p className="text-xs text-gray-400 mt-1">
              Оставьте пустым, чтобы не менять текущее изображение
            </p>
          </div>

          <div>
            <label className="block mb-1 text-customwhite">Ссылка на партнёра</label>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              required
              className="w-full bg-[#222] border border-customwhite/10 rounded px-3 py-2"
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 disabled:opacity-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-customyellow text-customblack rounded hover:bg-customyellow disabled:opacity-50"
            >
              {loading ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}