import React, { useEffect, useState } from 'react';
import { Client } from '../../services/httpClient';
import {
  NewsFrontendService,
  type UpdateNewsDto,
} from '../../services/news.service';
import { getPublicUrl } from '../../utils/publicUrl';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  item: {
    id: string;
    title: string;
    content: string;
    images: string[];
    publishedAt: string;
  };
}

const client = Client;
const newsService = new NewsFrontendService(client);

export default function NewsEditModal({ isOpen, onClose, item }: Props) {
  const [title, setTitle] = useState(item.title);
  const [content, setContent] = useState(item.content);
  const [images, setImages] = useState<string[]>(item.images || []);
  const [publishedDate, setPublishedDate] = useState(
    item.publishedAt
      ? new Date(item.publishedAt).toISOString().slice(0, 10)
      : ''
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTitle(item.title);
    setContent(item.content);
    setImages(item.images || []);
    setPublishedDate(
      item.publishedAt
        ? new Date(item.publishedAt).toISOString().slice(0, 10)
        : ''
    );
  }, [item]);


const onFileChange = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    setLoading(true);

    const url = await newsService.uploadTempImage(file);

    // 🔥 ВСЕГДА ОДНА КАРТИНКА
    setImages([url]);
  } catch {
    setError('Ошибка загрузки изображения');
  } finally {
    setLoading(false);
  }
};


  const removeImage = () => {
    setImages([]);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) return setError('Заголовок обязателен');
    if (!content.trim()) return setError('Контент обязателен');
    if (!images.length) return setError('Добавьте картинку');

    setLoading(true);
    try {
      const payload: UpdateNewsDto = {
        title: title.trim(),
        content: content.trim(),
        images, // ← массив из одного элемента
        publishedAt: publishedDate
          ? new Date(`${publishedDate}T00:00:00`).toISOString()
          : undefined,
      };

      await newsService.update(item.id, payload);
      onClose();
    } catch (err: any) {
      setError(err?.message ?? 'Ошибка сохранения');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-customblack/60 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-customgrey border border-customwhite/10 rounded-xl p-6 w-full max-w-2xl text-customwhite">
        <h2 className="text-2xl font-bold mb-4">Редактировать новость</h2>

        {error && <div className="text-[#FF6B4A] mb-3">{error}</div>}

        <form onSubmit={save} className="space-y-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-customblack px-3 py-2 rounded"
          />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            className="w-full bg-customblack px-3 py-2 rounded"
          />

          {/* КАРТИНКА */}
          <div className="space-y-2">
            {images.length > 0 ? (
              <div className="border border-customwhite/10 p-2 rounded w-48">
                <img
                  src={getPublicUrl(images[0])}
                  className="h-28 w-full object-cover rounded"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="text-[#FF6B4A] text-sm mt-2"
                >
                  Удалить
                </button>
              </div>
            ) : (
              <input
                type="file"
                accept="image/*"
                onChange={onFileChange}
                className="text-sm"
              />
            )}
          </div>

          <input
            type="date"
            value={publishedDate}
            onChange={(e) => setPublishedDate(e.target.value)}
            className="bg-customblack px-3 py-2 rounded"
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-customgrey px-4 py-2 rounded"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-customyellow text-customblack px-4 py-2 rounded"
            >
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
