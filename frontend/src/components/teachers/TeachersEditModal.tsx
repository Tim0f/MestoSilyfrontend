import React, { useState } from 'react';
import { Client } from '../../services/httpClient';
import {
  TeachersFrontendService,
  type UpdateTeacherDto,
} from '../../services/teachers.service';

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

  const [uploading, setUploading] = useState(false);

  const update = (k: keyof UpdateTeacherDto, v: any) =>
    setForm((p) => ({ ...p, [k]: v }));

  // ======== 🔥 ЗАГРУЗКА ФОТО =========
  const uploadPhoto = async (file: File | null) => {
    if (!file) return;
    try {
      setUploading(true);
      const res = await teachersService.uploadTempImage(file);

      if (res?.url) {
        update('photoUrl', res.url);
      }
    } catch (e) {
      console.error(e);
      alert('Ошибка загрузки изображения');
    } finally {
      setUploading(false);
    }
  };

  // ======== 🔥 ЗАГРУЗКА АУДИО =========
  const uploadAudio = async (file: File | null) => {
    if (!file) return;
    try {
      setUploading(true);
      const res = await teachersService.uploadTempAudio(file);

      if (res?.url) {
        update('audioUrl', res.url);
      }
    } catch (e) {
      alert('Ошибка загрузки аудио');
    } finally {
      setUploading(false);
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    await teachersService.update(teacher.id, form);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-customgrey border border-white/10 rounded-xl p-6 w-full max-w-xl text-white max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Редактировать преподавателя</h2>

        <form onSubmit={save} className="space-y-4">

          {/* Last Name */}
          <div>
            <label className="block mb-1 text-customwhite">Фамилия</label>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => update('lastName', e.target.value)}
              className="w-full bg-[#222] border border-white/10 px-3 py-2 rounded"
            />
          </div>

          {/* First Name */}
          <div>
            <label className="block mb-1 text-customwhite">Имя</label>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => update('firstName', e.target.value)}
              className="w-full bg-[#222] border border-white/10 px-3 py-2 rounded"
            />
          </div>

          {/* Middle Name */}
          <div>
            <label className="block mb-1 text-customwhite">Отчество</label>
            <input
              type="text"
              value={form.middleName || ''}
              onChange={(e) => update('middleName', e.target.value)}
              className="w-full bg-[#222] border border-white/10 px-3 py-2 rounded"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block mb-1 text-customwhite">Телефон</label>
            <input
              type="text"
              value={form.phone || ''}
              onChange={(e) => update('phone', e.target.value)}
              className="w-full bg-[#222] border border-white/10 px-3 py-2 rounded"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block mb-1 text-customwhite">Роль</label>
            <input
              type="text"
              value={form.role || ''}
              onChange={(e) => update('role', e.target.value)}
              className="w-full bg-[#222] border border-white/10 px-3 py-2 rounded"
            />
          </div>

          {/* Photo upload */}
          <div>
            <label className="block mb-1 text-customwhite">Фото преподавателя</label>

            {/* Preview */}
            {form.photoUrl && (
              <div className="mb-2">
                <img
                  src={form.photoUrl}
                  alt="preview"
                  className="w-32 h-32 object-cover rounded border border-white/10"
                />
              </div>
            )}

            <input
              type="file"
              onChange={(e) => uploadPhoto(e.target.files?.[0] || null)}
              disabled={uploading}
              className="text-sm"
            />
          </div>

          {/* Audio upload */}
          <div>
            <label className="block mb-1 text-customwhite">Аудиозапись</label>

            {form.audioUrl && (
              <audio
                controls
                className="w-full mb-2"
                src={form.audioUrl}
              />
            )}

            <input
              type="file"
              onChange={(e) => uploadAudio(e.target.files?.[0] || null)}
              disabled={uploading}
              className="text-sm"
            />
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
              className="px-4 py-2 bg-customyellow rounded text-black hover:bg-customyellow disabled:opacity-50"
              disabled={uploading}
            >
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
