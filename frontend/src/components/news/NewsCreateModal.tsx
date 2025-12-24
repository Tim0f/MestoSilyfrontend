import React, { useState } from 'react';
import { Client } from '../../services/httpClient';
import {
  NewsFrontendService,
  type CreateNewsDto,
} from '../../services/news.service';
import { getPublicUrl } from '../../utils/publicUrl';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const client = Client;
const newsService = new NewsFrontendService(client);

function getUserIdFromToken(): string | null {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub ?? null;
  } catch {
    return null;
  }
}

export default function NewsCreateModal({ isOpen, onClose }: Props) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [publishedDate, setPublishedDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const removeImage = () => {
    setImages([]);
  };

const handleFileUpload = async (file: File | null) => {
  if (!file) return;

  try {
    setLoading(true);

    const url = await newsService.uploadTempImage(file);

    // 🔥 ТОЛЬКО ОДНА КАРТИНКА
    setImages([url]);
  } catch (err) {
    console.error(err);
    setError('Ошибка загрузки изображения');
  } finally {
    setLoading(false);
  }
};



  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) return setError('Заголовок обязателен');
    if (!content.trim()) return setError('Контент обязателен');
    if (!images.length) return setError('Добавьте минимум одну картинку');
    if (!publishedDate) return setError('Выберите дату публикации');

    const createdBy = getUserIdFromToken();
    if (!createdBy) return setError('Не удалось получить userId');

    setLoading(true);
    try {
      const payload: CreateNewsDto = {
        title: title.trim(),
        content: content.trim(),
        images,
        publishedAt: new Date(`${publishedDate}T00:00:00`).toISOString(),
        createdBy,
      };

      await newsService.create(payload);
      onClose();
    } catch (err: any) {
      setError(err?.message ?? 'Ошибка создания новости');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-customgrey border border-white/10 rounded-xl p-6 w-full max-w-2xl text-white max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Создать новость</h2>

        {error && <div className="text-[#FF6B4A] mb-3">{error}</div>}

        <form onSubmit={submit} className="space-y-4">

          <div>
            <label className="block mb-1">Заголовок</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#222] border border-white/10 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1">Контент</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full bg-[#222] border border-white/10 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1">Изображения</label>

            <input
              type="file"
              onChange={(e) => handleFileUpload(e.target.files?.[0] || null)}
            />

            <div className="flex flex-wrap gap-3 mt-4">
              {images.length > 0 && (
  <div className="w-28">
    <div className="w-28 h-20 rounded overflow-hidden bg-[#222] border border-white/10">
      <img
        src={getPublicUrl(images[0])}
        className="w-full h-full object-cover"
      />
    </div>
    <button
      type="button"
      onClick={removeImage}
      className="text-[#FF6B4A] text-sm mt-1"
    >
      Удалить
    </button>
  </div>
)}

            </div>
          </div>

          <div>
            <label className="block mb-1">Дата публикации</label>
            <input
              type="date"
              value={publishedDate}
              onChange={(e) => setPublishedDate(e.target.value)}
              className="w-full bg-[#222] border border-white/10 rounded px-3 py-2"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="bg-gray-600 px-4 py-2 rounded">
              Отмена
            </button>
            <button type="submit" disabled={loading} className="bg-customyellow text-black px-4 py-2 rounded">
              Создать
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
