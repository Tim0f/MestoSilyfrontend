import React, { useState } from 'react';
import { Client } from '../../services/httpClient';
import {
  TeachersFrontendService,
  type CreateTeacherDto,
} from '../../services/teachers.service';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const client = Client;
const teachersService = new TeachersFrontendService(client);

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

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);

  const [loadingPhoto, setLoadingPhoto] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(false);

  const update = (k: keyof CreateTeacherDto, v: any) =>
    setForm((p) => ({ ...p, [k]: v }));

  // Загрузка фото
  const uploadPhoto = async (file: File | null) => {
    if (!file) return;

    setLoadingPhoto(true);
    try {
      const uploaded = await teachersService.uploadTempImage(file);

      if (uploaded?.url) {
  update('photoUrl', uploaded.url);
  setPhotoPreview(uploaded.url ?? null);
}

    } catch (err) {
      console.error(err);
      alert('Ошибка загрузки фото');
    } finally {
      setLoadingPhoto(false);
    }
  };

  // Загрузка аудио
  const uploadAudio = async (file: File | null) => {
    if (!file) return;

    setLoadingAudio(true);
    try {
      const uploaded = await teachersService.uploadTempAudio(file);

      if (uploaded?.url) {
  update('audioUrl', uploaded.url);
  setAudioPreview(uploaded.url ?? null);
}

    } catch (err) {
      console.error(err);
      alert('Ошибка загрузки аудио');
    } finally {
      setLoadingAudio(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await teachersService.create(form);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-customgrey border border-white/10 rounded-xl p-6 w-full max-w-xl text-white max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Создать преподавателя</h2>

        <form onSubmit={submit} className="space-y-4">
          
          {/* ФИО */}
          <div>
            <label className="block mb-1 text-customwhite">Фамилия</label>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => update('lastName', e.target.value)}
              className="w-full bg-[#222] border border-white/10 px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-customwhite">Имя</label>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => update('firstName', e.target.value)}
              className="w-full bg-[#222] border border-white/10 px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-customwhite">Отчество</label>
            <input
              type="text"
              value={form.middleName}
              onChange={(e) => update('middleName', e.target.value)}
              className="w-full bg-[#222] border border-white/10 px-3 py-2 rounded"
            />
          </div>

          {/* Телефон */}
          <div>
            <label className="block mb-1 text-customwhite">Телефон</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
              className="w-full bg-[#222] border border-white/10 px-3 py-2 rounded"
            />
          </div>

          {/* Роль */}
          <div>
            <label className="block mb-1 text-customwhite">Роль</label>
            <input
              type="text"
              value={form.role}
              onChange={(e) => update('role', e.target.value)}
              className="w-full bg-[#222] border border-white/10 px-3 py-2 rounded"
              placeholder="Например: тренер, наставник…"
            />
          </div>

          {/* Фото загрузка */}
          <div>
            <label className="block mb-1 text-customwhite">Фото</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => uploadPhoto(e.target.files?.[0] ?? null)}
              className="w-full bg-[#222] border border-white/10 px-3 py-2 rounded"
            />

            {loadingPhoto && <p className="text-sm text-yellow-400 mt-1">Загрузка...</p>}

            {photoPreview && (
              <img
                src={photoPreview}
                alt="preview"
                className="mt-3 w-32 h-32 object-cover rounded border border-white/20"
              />
            )}
          </div>

          {/* Аудио загрузка */}
          <div>
            <label className="block mb-1 text-customwhite">Аудио</label>
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => uploadAudio(e.target.files?.[0] ?? null)}
              className="w-full bg-[#222] border border-white/10 px-3 py-2 rounded"
            />

            {loadingAudio && <p className="text-sm text-yellow-400 mt-1">Загрузка...</p>}

            {audioPreview && (
              <audio controls className="mt-3 w-full">
                <source src={audioPreview} />
              </audio>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-customyellow rounded text-black hover:bg-customyellow"
            >
              Создать
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
