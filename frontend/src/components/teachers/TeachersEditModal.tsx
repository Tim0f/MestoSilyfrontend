import React, { useState, useEffect } from 'react';
import { Client } from '../../services/httpClient';
import {
  TeachersFrontendService,
  type UpdateTeacherDto,
} from '../../services/teachers.service';
import { UploadFrontendService } from '../../services/upload.service';
import { getPublicUrl } from '../../utils/publicUrl';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  teacher: {
    id: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    phone?: string;
    role?: string;
    photoUrl?: string;
    audioUrl?: string;
  };
}

const client = Client;
const teachersService = new TeachersFrontendService(client);
const uploadService = new UploadFrontendService(client);

export default function TeacherEditModal({ isOpen, onClose, teacher }: Props) {
  const [form, setForm] = useState<UpdateTeacherDto>({
    firstName: teacher.firstName,
    lastName: teacher.lastName,
    middleName: teacher.middleName,
    phone: teacher.phone,
    role: teacher.role,
    photoUrl: teacher.photoUrl,
    audioUrl: teacher.audioUrl,
  });

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Синхронизация при открытии и сброс файлов
  useEffect(() => {
    if (isOpen) {
      setForm({
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        middleName: teacher.middleName,
        phone: teacher.phone,
        role: teacher.role,
        photoUrl: teacher.photoUrl,
        audioUrl: teacher.audioUrl,
      });
      setPhotoFile(null);
      setAudioFile(null);
      setPhotoPreview(null);
      setAudioPreview(null);
      setError(null);
    }
  }, [isOpen, teacher]);

  const update = (k: keyof UpdateTeacherDto, v: any) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setPhotoFile(file);
    setPhotoPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setAudioFile(file);
    setAudioPreview(file ? URL.createObjectURL(file) : null);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let photoUrl = form.photoUrl; // оставляем старый, если новый не выбран
      if (photoFile) {
        const { filename } = await uploadService.image(photoFile);
        photoUrl = getPublicUrl(filename);
      }

      let audioUrl = form.audioUrl;
      if (audioFile) {
        // предполагаем, что uploadService имеет метод audio
        const { filename } = await uploadService.audio(audioFile);
        audioUrl = getPublicUrl(filename);
      }

      const payload: UpdateTeacherDto = {
        firstName: form.firstName?.trim(),
        lastName: form.lastName?.trim(),
        middleName: form.middleName?.trim() || undefined,
        phone: form.phone?.trim() || undefined,
        role: form.role?.trim() || undefined,
        photoUrl: photoUrl || undefined,
        audioUrl: audioUrl || undefined,
      };

      await teachersService.update(teacher.id, payload);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Ошибка при обновлении преподавателя');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-customblack/60 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-customgrey border border-customwhite/10 rounded-xl p-6 w-full max-w-xl text-customwhite max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Редактировать преподавателя</h2>

        <form onSubmit={save} className="space-y-4">
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 rounded px-3 py-2 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block mb-1 text-customwhite">Фамилия</label>
            <input
              type="text"
              value={form.lastName || ''}
              onChange={(e) => update('lastName', e.target.value)}
              className="w-full bg-[#222] border border-customwhite/10 px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-customwhite">Имя</label>
            <input
              type="text"
              value={form.firstName || ''}
              onChange={(e) => update('firstName', e.target.value)}
              className="w-full bg-[#222] border border-customwhite/10 px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-customwhite">Отчество</label>
            <input
              type="text"
              value={form.middleName || ''}
              onChange={(e) => update('middleName', e.target.value)}
              className="w-full bg-[#222] border border-customwhite/10 px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 text-customwhite">Телефон</label>
            <input
              type="text"
              value={form.phone || ''}
              onChange={(e) => update('phone', e.target.value)}
              className="w-full bg-[#222] border border-customwhite/10 px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 text-customwhite">Роль</label>
            <input
              type="text"
              value={form.role || ''}
              onChange={(e) => update('role', e.target.value)}
              className="w-full bg-[#222] border border-customwhite/10 px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 text-customwhite">Фото преподавателя</label>
            {/* Превью: либо новое локальное, либо старое из данных */}
            {(photoPreview || form.photoUrl) && (
              <div className="mb-2">
                <img
                  src={photoPreview || form.photoUrl}
                  alt="preview"
                  className="w-32 h-32 object-cover rounded border border-customwhite/10"
                />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              disabled={loading}
              className="text-sm"
            />
            <p className="text-xs text-gray-400 mt-1">
              Оставьте пустым, чтобы не менять текущее фото
            </p>
          </div>

          <div>
            <label className="block mb-1 text-customwhite">Аудиозапись</label>
            {(audioPreview || form.audioUrl) && (
              <audio controls className="w-full mb-2">
                <source src={audioPreview || form.audioUrl} />
              </audio>
            )}
            <input
              type="file"
              accept="audio/*"
              onChange={handleAudioChange}
              disabled={loading}
              className="text-sm"
            />
            <p className="text-xs text-gray-400 mt-1">
              Оставьте пустым, чтобы не менять текущую аудиозапись
            </p>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 disabled:opacity-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-customyellow rounded text-customblack hover:bg-customyellow disabled:opacity-50"
            >
              {loading ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}