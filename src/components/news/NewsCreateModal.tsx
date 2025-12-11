import React, { useState } from 'react';
import { Client } from '../../services/httpClient';
import {
  NewsFrontendService,
  type CreateNewsDto,
} from '../../services/news.service';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const client = Client

const newsService = new NewsFrontendService(client);

export default function NewsCreateModal({ isOpen, onClose }: Props) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [imageInput, setImageInput] = useState('');
  const [publishedDate, setPublishedDate] = useState(''); // YYYY-MM-DD
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addImage = () => {
    const url = imageInput.trim();
    if (!url) return;
    setImages((p) => [...p, url]);
    setImageInput('');
  };

  const removeImage = (idx: number) => {
    setImages((p) => p.filter((_, i) => i !== idx));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!title.trim()) return setError('Заголовок обязателен');
    if (!content.trim()) return setError('Контент обязателен');
    if (!images.length) return setError('Добавьте минимум одну картинку');
    if (!publishedDate) return setError('Выберите дату публикации');

    setLoading(true);
    try {
      const createdBy = localStorage.getItem('userId') || '';
      const payload: CreateNewsDto = {
        title: title.trim(),
        content: content.trim(),
        images: images.map((s) => s.trim()),
        // publishedAt: date ISO with time 00:00
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
            <label className="block mb-1 text-customwhite">Заголовок</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-[#222] border border-white/10 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 text-customwhite">Контент</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              required
              className="w-full bg-[#222] border border-white/10 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 text-customwhite">Изображения (URL)</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                className="flex-1 bg-[#222] border border-white/10 rounded px-3 py-2"
                placeholder="Вставьте URL и нажмите Добавить"
              />
              <button
                type="button"
                onClick={addImage}
                className="px-3 py-2 bg-[#5BC0EB] rounded hover:bg-blue-400"
              >
                Добавить
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {images.map((img, idx) => (
                <div key={idx} className="w-28">
                  <div className="w-28 h-20 overflow-hidden rounded bg-[#222] border border-white/10">
                    <img src={img} alt={`img-${idx}`} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex justify-between items-center mt-1 text-sm">
                    <span className="truncate">{img}</span>
                    <button type="button" onClick={() => removeImage(idx)} className="text-[#FF6B4A] ml-2">✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block mb-1 text-customwhite">Дата публикации</label>
            <input
              type="date"
              value={publishedDate}
              onChange={(e) => setPublishedDate(e.target.value)}
              required
              className="w-full bg-[#222] border border-white/10 rounded px-3 py-2"
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500">
              Отмена
            </button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-customyellow text-black rounded hover:bg-customyellow">
              Создать
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
