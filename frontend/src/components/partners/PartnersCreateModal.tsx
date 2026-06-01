import React, { useState, useEffect } from 'react';
import { Client } from '../../services/httpClient';
import {
  PartnersFrontendService,
} from '../../services/partners.service';
import { UploadFrontendService } from '../../services/upload.service';
import { getPublicUrl } from '../../utils/publicUrl';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const client = Client;
const partnersService = new PartnersFrontendService(client);
const uploadService = new UploadFrontendService(client);

export default function PartnerCreateModal({ isOpen, onClose }: Props) {
  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Сбрасываем форму при открытии
  useEffect(() => {
    if (isOpen) {
      setName('');
      setLink('');
      setFile(null);
      setPreview('');
      setError(null);
    }
  }, [isOpen]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setError(null); // убираем ошибку, если файл выбран
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Выберите изображение');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      // Загружаем файл и сразу формируем полный URL
      const { filename } = await uploadService.image(file);
      const imageUrl = getPublicUrl(filename);

      await partnersService.create({
        name: name.trim(),
        imageUrl,
        link: link.trim(),
      });

      onClose();
    } catch (err: any) {
      setError(err?.message || 'Ошибка при создании партнёра');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-customblack/60 flex items-center justify-center z-50">
      <div className="bg-customgrey border border-customwhite/10 rounded-xl p-6 w-full max-w-lg text-customwhite">
        <h2 className="text-xl font-bold mb-4">Создать партнёра</h2>

        <form onSubmit={submit} className="space-y-4">
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
              className="w-full bg-customblack border border-customwhite/10 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 text-customwhite">Изображение</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="w-full bg-customblack border border-customwhite/10 rounded px-3 py-2"
            />
            {preview && (
              <img
                src={preview}
                alt="preview"
                className="mt-2 max-h-40 rounded border border-customwhite/10"
              />
            )}
          </div>

          <div>
            <label className="block mb-1 text-customwhite">Ссылка на партнёра</label>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              required
              className="w-full bg-customblack border border-customwhite/10 rounded px-3 py-2"
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 bg-customgrey rounded hover:bg-customgrey disabled:opacity-50"
            >
              Отмена
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-customyellow text-customblack rounded hover:bg-customyellow disabled:opacity-50"
            >
              {loading ? 'Создание...' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}