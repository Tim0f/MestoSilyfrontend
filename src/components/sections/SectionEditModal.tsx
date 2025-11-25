// SectionEditModal.tsx
// Модалка редактирования секции с поддержкой загрузки изображений и иконок

import React, { useEffect, useState } from 'react';
import { HttpClient } from '../../services/httpClient';
import {
  SectionsFrontendService,
  type UpdateSectionDto,
} from '../../services/sections.service';
import { UploadFrontendService } from '../../services/upload.service';

interface Props {
  id: string;
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

export default function SectionEditModal({ id, onClose }: Props) {
  const [form, setForm] = useState<UpdateSectionDto>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (key: keyof UpdateSectionDto, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    loadSection();
  }, [id]);

  const loadSection = async () => {
    try {
      const data: any = await sectionsService.findOne(id);

      setForm({
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl,
        iconUrl: data.iconUrl,
        ageMin: data.ageMin,
        ageMax: data.ageMax,
        maxParticipants: data.maxParticipants,
        isActive: data.isActive,
      });
    } catch (err: any) {
      setError(err.message ?? 'Ошибка загрузки секции');
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (key: 'imageUrl' | 'iconUrl', file: File) => {
    try {
      setUploading(true);
      const result: any = await uploadService.image(file);
      if (result?.filename) {
        const url = uploadService.getFileUrl(result.filename);
        update(key, url);
      }
    } catch (err: any) {
      alert('Ошибка загрузки файла: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await sectionsService.update(id, form);
      onClose();
    } catch (err: any) {
      setError(err.message ?? 'Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 text-white">
        Загружаем секцию...
      </div>
    );

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#111] border border-white/10 p-8 rounded-xl w-full max-w-xl text-white">
        <h2 className="text-2xl font-bold mb-6">Редактировать секцию</h2>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        <form onSubmit={save} className="space-y-5">
          {/* NAME */}
          <div>
            <label className="block mb-1 text-gray-300">Название</label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-[#222] border border-white/10 rounded"
              value={form.name || ''}
              onChange={(e) => update('name', e.target.value)}
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block mb-1 text-gray-300">Описание</label>
            <textarea
              className="w-full px-3 py-2 bg-[#222] border border-white/10 rounded h-24"
              value={form.description || ''}
              onChange={(e) => update('description', e.target.value)}
            />
          </div>

          {/* AGES */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-gray-300">Возраст (мин)</label>
              <input
                type="number"
                className="w-full px-3 py-2 bg-[#222] border border-white/10 rounded"
                value={form.ageMin ?? 0}
                onChange={(e) => update('ageMin', Number(e.target.value))}
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-300">Возраст (макс)</label>
              <input
                type="number"
                className="w-full px-3 py-2 bg-[#222] border border-white/10 rounded"
                value={form.ageMax ?? 0}
                onChange={(e) => update('ageMax', Number(e.target.value))}
              />
            </div>
          </div>

          {/* MAX PARTICIPANTS */}
          <div>
            <label className="block mb-1 text-gray-300">Макс. участников</label>
            <input
              type="number"
              className="w-full px-3 py-2 bg-[#222] border border-white/10 rounded"
              value={form.maxParticipants ?? 0}
              onChange={(e) => update('maxParticipants', Number(e.target.value))}
            />
          </div>

          {/* IMAGE UPLOAD */}
          <div>
            <label className="block mb-1 text-gray-300">Изображение секции</label>

            {form.imageUrl && (
              <img
                src={form.imageUrl}
                className="w-full h-40 object-cover rounded border border-white/10 mb-2"
              />
            )}

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                e.target.files?.[0] && uploadFile('imageUrl', e.target.files[0])
              }
              className="w-full py-2"
            />

            {uploading && <p className="text-yellow-400 text-sm">Загрузка...</p>}
          </div>

          {/* ICON UPLOAD */}
          <div>
            <label className="block mb-1 text-gray-300">Иконка</label>

            {form.iconUrl && (
              <img
                src={form.iconUrl}
                className="h-20 object-contain rounded border border-white/10 mb-2"
              />
            )}

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                e.target.files?.[0] && uploadFile('iconUrl', e.target.files[0])
              }
              className="w-full py-2"
            />

            {uploading && <p className="text-yellow-400 text-sm">Загрузка...</p>}
          </div>

          {/* ACTIVE */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!form.isActive}
              onChange={(e) => update('isActive', e.target.checked)}
            />
            <label className="text-gray-300">Активна</label>
          </div>

          {/* ACTION BUTTONS */}
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
              disabled={saving}
              className="px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-400 disabled:opacity-60"
            >
              {saving ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
