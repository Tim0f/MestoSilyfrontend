import React, { useState } from "react";
import BaseModal from "../ui/BaseModal";
import { HttpClient } from "../../services/httpClient";
import { SectionsFrontendService, CreateSectionDto } from "../../services/sections.service";
import { UploadFrontendService } from "../../services/upload.service";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const client = new HttpClient({
  baseUrl:
    (import.meta.env.VITE_ADMIN_API_URL as string | undefined) ??
    (import.meta.env.VITE_API_URL as string | undefined) ??
    "http://localhost:3000/api",
  getToken: () => localStorage.getItem("token") ?? undefined,
});

const sectionsService = new SectionsFrontendService(client);
const uploadService = new UploadFrontendService(client);

export default function SectionCreateModal({ isOpen, onClose }: Props) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    imageUrl: "",
    iconUrl: "",
    galleryDriveUrl: "",
    ageMin: 1,
    ageMax: 1,
    maxParticipants: 1,
    isActive: true,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const uploadIfNeeded = async (file: File | null): Promise<string | undefined> => {
    if (!file) return undefined;
    try {
      const uploaded = await uploadService.image(file);
      return (uploaded as any).url;
    } catch (err) {
      console.error("Ошибка загрузки файла:", err);
      return undefined;
    }
  };

  const create = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setLoading(true);

  try {
    // Валидация
    if (!form.name.trim()) throw new Error("Название обязательно");
    if (!form.description.trim()) throw new Error("Описание обязательно");
    if (form.ageMin < 1 || form.ageMax < form.ageMin)
      throw new Error("Возраст некорректный");
    if (form.maxParticipants < 1)
      throw new Error("Максимальное количество участников должно быть ≥ 1");

    const imageUrl = await uploadIfNeeded(imageFile);
    const iconUrl = await uploadIfNeeded(iconFile);

    const payload: CreateSectionDto = {
  name: form.name.trim(),
  description: form.description.trim(),
  galleryDriveUrl: form.galleryDriveUrl.trim(),
  ageMin: Number(form.ageMin),
  ageMax: Number(form.ageMax),
  maxParticipants: Number(form.maxParticipants),
  isActive: form.isActive,
  // teacherIds можно не отправлять, если пустой
};

// Добавляем опциональные поля только если они есть
if (imageUrl) payload.imageUrl = imageUrl;
if (iconUrl) payload.iconUrl = iconUrl;
// if (form.teacherIds.length > 0) payload.teacherIds = form.teacherIds;


    console.log("Payload перед отправкой:", payload);

    await sectionsService.create(payload);
    onClose();
  } catch (err: any) {
    console.error("Ошибка создания секции:", err);
    setError(err.message || "Ошибка создания секции");
  } finally {
    setLoading(false);
  }
};


  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Создать секцию">
      <form onSubmit={create} className="space-y-4 text-white">
        {error && <div className="text-red-500">{error}</div>}

        <div>
          <label className="block mb-1">Название</label>
          <input
            className="w-full bg-[#222] rounded px-3 py-2"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Описание</label>
          <textarea
            className="w-full bg-[#222] rounded px-3 py-2"
            value={form.description}
            rows={3}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1">Фото секции</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
          />
        </div>

        <div>
          <label className="block mb-1">Иконка секции</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setIconFile(e.target.files?.[0] ?? null)}
          />
        </div>

        <div>
          <label className="block mb-1">Ссылка на галерею Google Drive</label>
          <input
            className="w-full bg-[#222] rounded px-3 py-2"
            value={form.galleryDriveUrl}
            onChange={(e) => handleChange("galleryDriveUrl", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block mb-1">Возраст мин.</label>
            <input
              type="number"
              min={1}
              className="w-full bg-[#222] rounded px-3 py-2"
              value={form.ageMin}
              onChange={(e) => handleChange("ageMin", Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block mb-1">Возраст макс.</label>
            <input
              type="number"
              min={form.ageMin}
              className="w-full bg-[#222] rounded px-3 py-2"
              value={form.ageMax}
              onChange={(e) => handleChange("ageMax", Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block mb-1">Макс. участников</label>
            <input
              type="number"
              min={1}
              className="w-full bg-[#222] rounded px-3 py-2"
              value={form.maxParticipants}
              onChange={(e) => handleChange("maxParticipants", Number(e.target.value))}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-400 disabled:opacity-50"
        >
          {loading ? "Создание..." : "Создать"}
        </button>
      </form>
    </BaseModal>
  );
}
