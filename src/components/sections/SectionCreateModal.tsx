import React, { useState } from 'react';
import { HttpClient } from '../../services/httpClient';
import {
  SectionsFrontendService,
  type CreateSectionDto,
} from '../../services/sections.service';
import { UploadFrontendService } from '../../services/upload.service';

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

const sectionsService = new SectionsFrontendService(client);
const uploadService = new UploadFrontendService(client);

export default function SectionCreateModal({ isOpen, onClose }: Props) {
  const [form, setForm] = useState<CreateSectionDto>({
    name: '',
    description: '',
    imageUrl: '',
    iconUrl: '',
    ageMin: 0,
    ageMax: 0,
    maxParticipants: 0,
    isActive: true,
    galleryDriveUrl: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [iconFile, setIconFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChange = (key: keyof CreateSectionDto, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const upload = async (file: File | null) => {
    if (!file) return '';
    const res = await uploadService.image<{ url: string }>(file);
    return res.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Загрузка картинок
      const uploadedImageUrl = await upload(imageFile);
      const uploadedIconUrl = await upload(iconFile);

      const dto: CreateSectionDto = {
        ...form,
        imageUrl: uploadedImageUrl,
        iconUrl: uploadedIconUrl,
      };

      await sectionsService.create(dto);
      onClose();
    } catch (err: any) {
      setError(err?.details?.message ?? err.message ?? 'Ошибка создания секции');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#111] border border-white/10 p-8 rounded-xl w-full max-w-xl text-white">
        <h2 className="text-2xl font-bold mb-6">Создать секцию</h2>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-gray-300">Название</label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded bg-[#222]"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Описание</label>
            <textarea
              className="w-full px-3 py-2 rounded bg-[#222] h-24"
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-gray-300">Возраст (мин)</label>
              <input
                type="number"
                className="w-full px-3 py-2 rounded bg-[#222]"
                value={form.ageMin}
                onChange={(e) => handleChange('ageMin', Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-300">Возраст (макс)</label>
              <input
                type="number"
                className="w-full px-3 py-2 rounded bg-[#222]"
                value={form.ageMax}
                onChange={(e) => handleChange('ageMax', Number(e.target.value))}
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Максимум участников</label>
            <input
              type="number"
              className="w-full px-3 py-2 rounded bg-[#222]"
              value={form.maxParticipants}
              onChange={(e) =>
                handleChange('maxParticipants', Number(e.target.value))
              }
            />
          </div>

          {/* Загрузка главного изображения */}
          <div>
            <label className="block mb-1 text-gray-300">
              Главное изображение
            </label>
            <input
              type="file"
              className="text-gray-300"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            />
          </div>

          {/* Загрузка иконки */}
          <div>
            <label className="block mb-1 text-gray-300">Иконка</label>
            <input
              type="file"
              className="text-gray-300"
              accept="image/*"
              onChange={(e) => setIconFile(e.target.files?.[0] ?? null)}
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">
              Ссылка на галерею (Google Drive)
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded bg-[#222]"
              value={form.galleryDriveUrl}
              onChange={(e) => handleChange('galleryDriveUrl', e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => handleChange('isActive', e.target.checked)}
            />
            <label className="text-gray-300">Активна</label>
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
              {loading ? 'Создание...' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
