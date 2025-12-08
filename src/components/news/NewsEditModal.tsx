import React, { useEffect, useState } from 'react';
import { Client } from '../../services/httpClient';
import {
  NewsFrontendService,
  type UpdateNewsDto,
} from '../../services/news.service';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  item: {
    id: string;
    title: string;
    content: string;
    images: string[];
    imageUrl?: string;
    publishedAt: string;
    createdBy?: string;
  };
}

const client = Client

const newsService = new NewsFrontendService(client);

export default function NewsEditModal({ isOpen, onClose, item }: Props) {
  const [title, setTitle] = useState(item.title);
  const [content, setContent] = useState(item.content);
  const [images, setImages] = useState<string[]>(item.images || []);
  const [newImageInput, setNewImageInput] = useState('');
  const [activeImage, setActiveImage] = useState<string | undefined>(item.imageUrl || (item.images && item.images[0]));
  const [publishedDate, setPublishedDate] = useState(() => {
    // Keep only date portion
    return item.publishedAt ? new Date(item.publishedAt).toISOString().slice(0, 10) : '';
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // sync when item changes
    setTitle(item.title);
    setContent(item.content);
    setImages(item.images || []);
    setActiveImage(item.imageUrl || (item.images && item.images[0]));
    setPublishedDate(item.publishedAt ? new Date(item.publishedAt).toISOString().slice(0, 10) : '');
  }, [item]);

  const addImage = () => {
    const url = newImageInput.trim();
    if (!url) return;
    setImages((p) => [...p, url]);
    setNewImageInput('');
  };

  const removeImage = (idx: number) => {
    setImages((p) => p.filter((_, i) => i !== idx));
    // if removed active image, clear or set fallback
    if (images[idx] === activeImage) {
      setActiveImage((prev) => {
        const after = images.filter((_, i) => i !== idx);
        return after[0];
      });
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!title.trim()) return setError('Заголовок обязателен');
    if (!content.trim()) return setError('Контент обязателен');
    if (!images.length) return setError('Добавьте минимум одну картинку');
    if (!publishedDate) return setError('Выберите дату');

    setLoading(true);
    try {
      const payload: UpdateNewsDto = {
        title: title.trim(),
        content: content.trim(),
        images: images.map((s) => s.trim()),
        imageUrl: activeImage,
        publishedAt: new Date(`${publishedDate}T00:00:00`).toISOString(),
        // createdBy left untouched
      };

      await newsService.update(item.id, payload);
      onClose();
    } catch (err: any) {
      setError(err?.message ?? 'Ошибка сохранения новости');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-[#111] border border-white/10 rounded-xl p-6 w-full max-w-2xl text-white max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Редактировать новость</h2>

        {error && <div className="text-red-400 mb-3">{error}</div>}

        <form onSubmit={save} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-300">Заголовок</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-[#222] border border-white/10 rounded px-3 py-2" />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Контент</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={6} className="w-full bg-[#222] border border-white/10 rounded px-3 py-2" />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Картинки (URL)</label>

            <div className="flex gap-2 mb-2">
              <input value={newImageInput} onChange={(e) => setNewImageInput(e.target.value)} className="flex-1 bg-[#222] border border-white/10 rounded px-3 py-2" placeholder="Добавить URL" />
              <button type="button" onClick={addImage} className="px-3 py-2 bg-blue-500 rounded hover:bg-blue-400">Добавить</button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {images.map((img, idx) => (
                <div key={idx} className="border border-white/10 rounded p-2">
                  <div className="w-full h-28 overflow-hidden rounded bg-[#222]">
                    <img src={img} alt={`img-${idx}`} className="w-full h-full object-cover" />
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="activeImage" checked={activeImage === img} onChange={() => setActiveImage(img)} />
                      <span className="text-sm truncate">{img}</span>
                    </label>

                    <button type="button" onClick={() => removeImage(idx)} className="text-red-400">✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Дата публикации</label>
            <input type="date" value={publishedDate} onChange={(e) => setPublishedDate(e.target.value)} className="w-full bg-[#222] border border-white/10 rounded px-3 py-2" />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500">Отмена</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-400">Сохранить</button>
          </div>
        </form>
      </div>
    </div>
  );
}
