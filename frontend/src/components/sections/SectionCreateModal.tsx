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

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [iconFile, setIconFile] = useState<File | null>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);

  useEffect(() => {
    teachersService.findAll().then(setTeachers);
  }, []);

  const handleChange = (k: string, v: any) =>
    setForm((p) => ({ ...p, [k]: v }));

  const selectTeacher = (id: string) =>
    setForm((p) => ({ ...p, teacherIds: [id] }));

  const uploadIfNeeded = async (file: File | null) => {
    if (!file) return undefined;
    const { filename } = await uploadService.image(file);
    return filename; // 🔥 ВАЖНО: сохраняем ТОЛЬКО filename
  };

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const imageFilename = await uploadIfNeeded(imageFile);
      const iconFilename = await uploadIfNeeded(iconFile);

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
        imageUrl: imageFilename,
        iconUrl: iconFilename,
      };

      const created: any = await sectionsService.create(payload);

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

        <input
          className="w-full bg-[#222] rounded px-3 py-2"
          placeholder="Название"
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
          required
        />

        <textarea
          className="w-full bg-[#222] rounded px-3 py-2"
          placeholder="Описание"
          value={form.description}
          onChange={(e) => handleChange('description', e.target.value)}
        />

        {/* Учителя */}
        <div className="grid grid-cols-2 gap-2">
          {teachers.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => selectTeacher(t.id)}
              className="flex items-center gap-2 p-2 bg-[#222] rounded"
            >
              {t.photoUrl && (
                <img
                  src={getPublicUrl(t.photoUrl)}
                  className="w-10 h-10 rounded object-cover"
                />
              )}
              {t.lastName} {t.firstName}
            </button>
          ))}
        </div>

        {/* Фото */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const f = e.target.files?.[0] ?? null;
            setImageFile(f);
            setImagePreview(f ? URL.createObjectURL(f) : null);
          }}
        />

        {imagePreview && (
          <img src={imagePreview} className="w-32 rounded" />
        )}

        {/* Иконка */}
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
          <img src={iconPreview} className="w-20 rounded" />
        )}

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
