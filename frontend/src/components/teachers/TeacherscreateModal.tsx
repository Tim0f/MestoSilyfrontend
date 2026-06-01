import React, { useState, useEffect } from 'react';
import { Client } from '../../services/httpClient';
import {
  TeachersFrontendService,
  type CreateTeacherDto,
} from '../../services/teachers.service';
import { UploadFrontendService } from '../../services/upload.service';
import { getPublicUrl } from '../../utils/publicUrl';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const client = Client;
const teachersService = new TeachersFrontendService(client);
const uploadService = new UploadFrontendService(client);

export default function TeacherCreateModal({ isOpen, onClose }: Props) {
  const [form, setForm] = useState<CreateTeacherDto>({
    firstName: '',
    lastName: '',
    middleName: '',
    phone: '',
    role: '',
    photoUrl: '',
    audioUrl: '',
  });

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Сброс формы при открытии
  useEffect(() => {
    if (isOpen) {
      setForm({
        firstName: '',
        lastName: '',
        middleName: '',
        phone: '',
        role: '',
        photoUrl: '',
        audioUrl: '',
      });
      setPhotoFile(null);
      setAudioFile(null);
      setPhotoPreview(null);
      setAudioPreview(null);
      setError(null);
    }
  }, [isOpen]);

  const update = (k: keyof CreateTeacherDto, v: any) =>
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

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let photoUrl = '';
      if (photoFile) {
        const { filename } = await uploadService.image(photoFile);
        photoUrl = getPublicUrl(filename);
      }

      let audioUrl = '';
      if (audioFile) {
        // Предполагаем, что uploadService имеет метод audio. Если нет, замените на uploadService.file или аналогичный.
        const { filename } = await uploadService.audio(audioFile);
        audioUrl = getPublicUrl(filename);
      }

const payload: CreateTeacherDto = {
  firstName: form.firstName.trim(),
  lastName: form.lastName.trim(),
  middleName: form.middleName?.trim() || undefined,
  phone: form.phone?.trim() || undefined,
  role: form.role?.trim() || undefined,
  photoUrl: photoUrl || undefined,
  audioUrl: audioUrl || undefined,
};

      await teachersService.create(payload);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Ошибка при создании преподавателя');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-customblack/60 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-customgrey border border-customwhite/10 rounded-xl p-6 w-full max-w-xl text-customwhite max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Создать преподавателя</h2>

        <form onSubmit={submit} className="space-y-4">
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 rounded px-3 py-2 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block mb-1 text-customwhite">Фамилия</label>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => update('lastName', e.target.value)}
              className="w-full bg-customblack border border-customwhite/10 px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-customwhite">Имя</label>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => update('firstName', e.target.value)}
              className="w-full bg-customblack border border-customwhite/10 px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-customwhite">Отчество</label>
            <input
              type="text"
              value={form.middleName}
              onChange={(e) => update('middleName', e.target.value)}
              className="w-full bg-customblack border border-customwhite/10 px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 text-customwhite">Телефон</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
              className="w-full bg-customblack border border-customwhite/10 px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 text-customwhite">Роль</label>
            <input
              type="text"
              value={form.role}
              onChange={(e) => update('role', e.target.value)}
              className="w-full bg-customblack border border-customwhite/10 px-3 py-2 rounded"
              placeholder="Например: тренер, наставник…"
            />
          </div>

          <div>
            <label className="block mb-1 text-customwhite">Фото</label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="w-full bg-customblack border border-customwhite/10 px-3 py-2 rounded"
            />
            {photoPreview && (
              <img
                src={photoPreview}
                alt="preview"
                className="mt-3 w-32 h-32 object-cover rounded border border-customwhite/20"
              />
            )}
          </div>

          <div>
            <label className="block mb-1 text-customwhite">Аудио</label>
            <input
              type="file"
              accept="audio/*"
              onChange={handleAudioChange}
              className="w-full bg-customblack border border-customwhite/10 px-3 py-2 rounded"
            />
            {audioPreview && (
              <audio controls className="mt-3 w-full">
                <source src={audioPreview} />
              </audio>
            )}
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 bg-customgrey rounded hover:bg-customgrey disabled:opacity-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-customyellow rounded text-customblack hover:bg-customyellow disabled:opacity-50"
            >
              {loading ? 'Создание...' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}