import React, { useEffect, useState } from 'react';
import BaseModal from '../ui/BaseModal';
import { Client } from '../../services/httpClient';
import {
  SectionsFrontendService,
  CreateSectionDto,
} from '../../services/sections.service';
import { UploadFrontendService } from '../../services/upload.service';
import {
  TeachersFrontendService,
  TeacherDto,
} from '../../services/teachers.service';
import { ChatFrontendService } from '../../services/chat.service';
import { getPublicUrl } from '../../utils/publicUrl';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const client = Client;
const sectionsService = new SectionsFrontendService(client);
const uploadService = new UploadFrontendService(client);
const teachersService = new TeachersFrontendService(client);
const chatService = new ChatFrontendService(client);

export default function SectionCreateModal({ isOpen, onClose }: Props) {
  const [teachers, setTeachers] = useState<TeacherDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    description: '',
    galleryDriveUrl: '',
    ageMin: 5,
    ageMax: 5,
    maxParticipants: undefined as number | undefined,
    price: 0,
    isActive: true,
    teacherIds: [] as string[],
  });

  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);

  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  useEffect(() => {
    teachersService.findAll().then(setTeachers);
  }, []);

  const handleChange = (k: string, v: any) =>
    setForm((p) => ({ ...p, [k]: v }));

  const selectTeacher = (id: string) =>
    setForm((p) => ({ ...p, teacherIds: [id] }));

  const handleGallerySelect = (files: FileList | null) => {
    if (!files) return;
    const fileArray = Array.from(files);
    setGalleryFiles((prev) => [...prev, ...fileArray]);
    setGalleryPreviews((prev) => [
      ...prev,
      ...fileArray.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const removeGalleryItem = (index: number) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Загружаем иконку через отдельный эндпоинт (будет сделано после создания секции)
      // Но сейчас иконка передаётся в create как filename, поэтому сначала загружаем иконку
      let iconFilename: string | undefined;
      if (iconFile) {
        const uploaded = await uploadService.image(iconFile);
        iconFilename = uploaded.filename;
      }

      // 1. Создаём секцию без основного фото (imageUrl undefined)
      const payload: CreateSectionDto = {
        name: form.name,
        description: form.description || undefined,
        galleryDriveUrl: form.galleryDriveUrl || undefined,
        ageMin: form.ageMin,
        ageMax: form.ageMax,
        maxParticipants: form.maxParticipants,
        price: form.price,
        isActive: form.isActive,
        teacherIds: form.teacherIds.length ? form.teacherIds : undefined,
        imageUrl: undefined,
        iconUrl: iconFilename,
      };

      const created: any = await sectionsService.create(payload);

      // 2. Загружаем все файлы галереи напрямую через addImageFromFile
      if (galleryFiles.length > 0) {
        await Promise.all(
          galleryFiles.map((file, index) =>
            sectionsService.addImageFromFile(created.id, file, index + 1)
          )
        );

        // 3. Получаем список изображений и устанавливаем первое как основное фото
        const images: { imageUrl: string }[] = await sectionsService.getImages(created.id);
        if (images.length > 0) {
          const mainImage = images[0].imageUrl;
          const filename = mainImage.split('/').pop() ?? mainImage;
          await sectionsService.update(created.id, {
            imageUrl: filename,
          } as any);
        }
      }

      await chatService.createChat({
        type: 'SECTION',
        sectionId: created.id,
      });

      onClose();
    } catch (err: any) {
      setError(err.message || 'Ошибка создания секции');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Создать секцию">
      <form onSubmit={create} className="space-y-4 text-customwhite">
        {error && <div className="text-red-500">{error}</div>}

        <div>
          <label className="block mb-1">Название</label>
          <input
            className="w-full bg-customblack rounded px-3 py-2"
            placeholder="Введите название"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Описание</label>
          <textarea
            className="w-full bg-customblack rounded px-3 py-2"
            placeholder="Введите описание"
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1">Учитель</label>
          <div className="grid grid-cols-2 gap-2">
            {teachers.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => selectTeacher(t.id)}
                className={`flex items-center gap-2 p-2 rounded border ${
                  form.teacherIds[0] === t.id
                    ? 'border-customyellow bg-customyellow/20'
                    : 'border-customwhite/10 bg-customblack'
                }`}
              >
                {t.photoUrl && (
                  <img
                    src={getPublicUrl(t.photoUrl)}
                    className="w-10 h-10 rounded object-cover"
                    alt=""
                  />
                )}
                {t.lastName} {t.firstName}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-1">Иконка</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0] ?? null;
              setIconFile(f);
              setIconPreview(f ? URL.createObjectURL(f) : null);
            }}
          />
          {iconPreview && (
            <img src={iconPreview} className="w-20 rounded mt-2" alt="" />
          )}
        </div>

        <div>
          <label className="block mb-1">
            Фотографии секции (первое станет главным)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleGallerySelect(e.target.files)}
          />
          {galleryPreviews.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {galleryPreviews.map((src, idx) => (
                <div key={idx} className="relative">
                  <img src={src} className="w-20 h-20 object-cover rounded" alt="" />
                  <button
                    type="button"
                    onClick={() => removeGalleryItem(idx)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block mb-1">Ссылка на Google Drive галерею</label>
          <input
            className="w-full bg-customblack rounded px-3 py-2"
            placeholder="https://drive.google.com/..."
            value={form.galleryDriveUrl}
            onChange={(e) => handleChange('galleryDriveUrl', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block mb-1 text-sm">Мин. возраст</label>
            <input
              type="number"
              className="w-full bg-customblack rounded px-3 py-2"
              value={form.ageMin}
              onChange={(e) => handleChange('ageMin', Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">Макс. возраст</label>
            <input
              type="number"
              className="w-full bg-customblack rounded px-3 py-2"
              value={form.ageMax}
              onChange={(e) => handleChange('ageMax', Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">Макс. участников</label>
            <input
              type="number"
              className="w-full bg-customblack rounded px-3 py-2"
              value={form.maxParticipants ?? ''}
              onChange={(e) =>
                handleChange(
                  'maxParticipants',
                  e.target.value === '' ? undefined : Number(e.target.value)
                )
              }
            />
          </div>
        </div>

        <div>
          <label className="block mb-1">Цена (₽)</label>
          <input
            type="number"
            className="w-full bg-customblack rounded px-3 py-2"
            value={form.price}
            onChange={(e) => handleChange('price', Number(e.target.value))}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => handleChange('isActive', e.target.checked)}
          />
          <label>Активна?</label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-customyellow text-customblack rounded px-4 py-2"
        >
          {loading ? 'Создание...' : 'Создать'}
        </button>
      </form>
    </BaseModal>
  );
}