// EventEditModal.tsx
// Модалка редактирования события

import React, { useEffect, useState } from 'react';
import { Client } from '../../services/httpClient';
import {
  EventsFrontendService,
  type UpdateEventDto,
} from '../../services/events.service';
import { ensureFormData } from '../../services/fileUpload';

interface Props {
  id: string;
  onClose: () => void;
}

const client = Client

const eventsService = new EventsFrontendService(client);

export default function EventEditModal({ id, onClose }: Props) {
  const [form, setForm] = useState<UpdateEventDto>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, [id]);

  const load = async () => {
    try {
      const data: any = await eventsService.findOne(id);

      setForm({
        name: data.name,
        title: data.title,
        description: data.description,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        price: data.price,
        maxParticipants: data.maxParticipants,
        textColor: data.textColor,
        imageUrl: data.imageUrl,
        bannerUrl: data.bannerUrl,
        createdBy: data.createdBy,
      });

      setLoading(false);
    } catch (err: any) {
      setError(err.message ?? 'Ошибка загрузки события');
      setLoading(false);
    }
  };

  const handleChange = (key: keyof UpdateEventDto, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await eventsService.update(id, form);
      onClose();
    } catch (err: any) {
      setError(err.message ?? 'Ошибка сохранения');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File | null) => {
    if (!file) return;
    try {
      await eventsService.uploadImage(id, file);
      load();
    } catch (err: any) {
      alert('Ошибка загрузки изображения');
    }
  };

  const handleBannerUpload = async (file: File | null) => {
    if (!file) return;
    try {
      await eventsService.uploadBanner(id, file);
      load();
    } catch (err: any) {
      alert('Ошибка загрузки баннера');
    }
  };

  if (loading)
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 text-white">
        Загрузка...
      </div>
    );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-customgrey border border-white/10 p-8 rounded-xl w-full max-w-xl text-white">
        <h2 className="text-2xl font-bold mb-6">Редактировать событие</h2>

        {error && <p className="text-[#FF6B4A] mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* name */}
          <div>
            <label className="block mb-1 text-customwhite">Служебное имя</label>
            <input
              type="text"
              value={form.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#222] border border-white/10"
            />
          </div>

          {/* title */}
          <div>
            <label className="block mb-1 text-customwhite">Заголовок</label>
            <input
              type="text"
              value={form.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#222] border border-white/10"
            />
          </div>

          {/* description */}
          <div>
            <label className="block mb-1 text-customwhite">Описание</label>
            <textarea
              value={form.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#222] border border-white/10"
              rows={3}
            />
          </div>

          {/* date */}
          <div>
            <label className="block mb-1 text-customwhite">Дата</label>
            <input
              type="date"
              value={form.date || ''}
              onChange={(e) => handleChange('date', e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#222] border border-white/10"
            />
          </div>

          {/* times */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-customwhite">Начало</label>
              <input
                type="time"
                value={form.startTime || ''}
                onChange={(e) => handleChange('startTime', e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#222] border border-white/10"
              />
            </div>

            <div>
              <label className="block mb-1 text-customwhite">Окончание</label>
              <input
                type="time"
                value={form.endTime || ''}
                onChange={(e) => handleChange('endTime', e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#222] border border-white/10"
              />
            </div>
          </div>

          {/* price */}
          <div>
            <label className="block mb-1 text-customwhite">Цена</label>
            <input
              type="number"
              value={form.price ?? 0}
              onChange={(e) => handleChange('price', Number(e.target.value))}
              className="w-full px-3 py-2 rounded bg-[#222] border border-white/10"
            />
          </div>

          {/* maxParticipants */}
          <div>
            <label className="block mb-1 text-customwhite">Максимум участников</label>
            <input
              type="number"
              value={form.maxParticipants ?? 0}
              onChange={(e) => handleChange('maxParticipants', Number(e.target.value))}
              className="w-full px-3 py-2 rounded bg-[#222] border border-white/10"
            />
          </div>

          {/* textColor */}
          <div>
            <label className="block mb-1 text-customwhite">Цвет текста</label>
            <input
              type="color"
              value={form.textColor || '#ffffff'}
              onChange={(e) => handleChange('textColor', e.target.value)}
              className="w-full h-10 bg-[#222] border border-white/10 rounded"
            />
          </div>

          {/* Image */}
          <div className="space-y-2">
            <p className="text-customwhite">Изображение</p>
            <img
              src={form.imageUrl}
              alt="image"
              className="w-full max-h-40 object-cover rounded border border-white/10"
            />
            <input
              type="file"
              onChange={(e) => handleImageUpload(e.target.files?.[0] || null)}
              className="w-full text-customwhite"
            />
          </div>

          {/* Banner */
          <div className="space-y-2">
            <p className="text-customwhite">Баннер</p>
            {form.bannerUrl && (
              <img
                src={form.bannerUrl}
                alt="banner"
                className="w-full max-h-40 object-cover rounded border border-white/10"
              />
            )}
            <input
              type="file"
              onChange={(e) => handleBannerUpload(e.target.files?.[0] || null)}
              className="w-full text-customwhite"
            />
          </div>}

          {/* createdBy */}
          <div>
            <label className="block mb-1 text-customwhite">ID создателя</label>
            <input
              type="text"
              value={form.createdBy || ''}
              onChange={(e) => handleChange('createdBy', e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#222] border border-white/10"
            />
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
              className="px-4 py-2 bg-customyellow text-black rounded font-semibold hover:bg-customyellow disabled:opacity-60"
            >
              Сохранить изменения
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}