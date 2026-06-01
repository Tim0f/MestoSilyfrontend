// EventCreateModal.tsx
// Модалка создания события

import React, { useState } from 'react';
import { Client } from '../../services/httpClient';
import {
  EventsFrontendService,
  type CreateEventDto,
} from '../../services/events.service';
import { UploadFrontendService } from '../../services/upload.service';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const client = Client;

const eventsService = new EventsFrontendService(client);
const uploadService = new UploadFrontendService(client);

export default function EventCreateModal({ isOpen, onClose }: Props) {
  const [form, setForm] = useState<CreateEventDto>({
    name: '',
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    price: 0,
    maxParticipants: 0,
    textColor: '#ffffff',
    imageUrl: '',
    bannerUrl: '',
    createdBy: localStorage.getItem('userId') || '',
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Новый блок — файлы + превью
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const handleChange = (key: keyof CreateEventDto, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const handleBannerSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setBannerFile(file);
    if (file) setBannerPreview(URL.createObjectURL(file));
  };

  const uploadIfNeeded = async (file: File | null) => {
    if (!file) return undefined;
    const uploaded = await uploadService.image(file);
    return (uploaded as any).url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const newImageUrl = await uploadIfNeeded(imageFile);
      const newBannerUrl = await uploadIfNeeded(bannerFile);

      const payload = {
        ...form,
        imageUrl: newImageUrl ?? form.imageUrl,
        bannerUrl: newBannerUrl ?? form.bannerUrl,
        date: new Date(`${form.date}T${form.startTime}:00`).toISOString(),
      };

      await eventsService.create(payload);

      onClose();
    } catch (err: any) {
      setError(err.message ?? 'Ошибка создания события');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 overflow-y-auto bg-customblack/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-customgrey border border-customwhite/10 p-8 rounded-xl w-full max-w-xl max-h-[90vh] overflow-y-auto text-customwhite">
        <h2 className="text-2xl font-bold mb-6">Создать событие</h2>

        {error && <p className="text-[#FF6B4A] mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* name */}
          <div>
            <label className="block mb-1">Служебное имя</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#222] border border-customwhite/10"
              required
            />
          </div>

          {/* title */}
          <div>
            <label className="block mb-1">Заголовок</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#222] border border-customwhite/10"
              required
            />
          </div>

          {/* description */}
          <div>
            <label className="block mb-1">Описание</label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#222] border border-customwhite/10"
              rows={3}
              required
            />
          </div>

          {/* date */}
          <div>
            <label className="block mb-1">Дата</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => handleChange('date', e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#222] border border-customwhite/10"
              required
            />
          </div>

          {/* times */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Начало</label>
              <input
                type="time"
                value={form.startTime}
                onChange={(e) => handleChange('startTime', e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#222] border border-customwhite/10"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Окончание</label>
              <input
                type="time"
                value={form.endTime}
                onChange={(e) => handleChange('endTime', e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#222] border border-customwhite/10"
                required
              />
            </div>
          </div>

          {/* price */}
          <div>
            <label className="block mb-1">Цена</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => handleChange('price', Number(e.target.value))}
              className="w-full px-3 py-2 rounded bg-[#222] border border-customwhite/10"
              required
            />
          </div>

          {/* maxParticipants */}
          <div>
            <label className="block mb-1">Максимум участников</label>
            <input
              type="number"
              value={form.maxParticipants}
              onChange={(e) =>
                handleChange('maxParticipants', Number(e.target.value))
              }
              className="w-full px-3 py-2 rounded bg-[#222] border border-customwhite/10"
              required
            />
          </div>

          {/* textColor */}
          <div>
            <label className="block mb-1">Цвет текста</label>
            <input
              type="color"
              value={form.textColor}
              onChange={(e) => handleChange('textColor', e.target.value)}
              className="w-full h-10 bg-[#222] border border-customwhite/10 rounded"
            />
          </div>

          {/* image upload */}
          <div>
            <label className="block mb-1">Изображение события</label>

            {imagePreview ? (
              <img src={imagePreview} className="w-32 rounded mb-2" />
            ) : form.imageUrl ? (
              <img src={form.imageUrl} className="w-32 rounded mb-2" />
            ) : null}

            <input type="file" accept="image/*" onChange={handleImageSelect} />
          </div>

          {/* banner upload */}
          <div>
            <label className="block mb-1">Баннер события</label>

            {bannerPreview ? (
              <img src={bannerPreview} className="w-32 rounded mb-2" />
            ) : form.bannerUrl ? (
              <img src={form.bannerUrl} className="w-32 rounded mb-2" />
            ) : null}

            <input type="file" accept="image/*" onChange={handleBannerSelect} />
          </div>

          {/* actions */}
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
              className="px-4 py-2 bg-customyellow text-customblack rounded font-semibold hover:bg-customyellow disabled:opacity-60"
            >
              Создать
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
