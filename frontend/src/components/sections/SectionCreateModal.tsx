import React, { useState, useEffect } from "react";
import BaseModal from "../ui/BaseModal";
import { Client } from "../../services/httpClient";
import {
  SectionsFrontendService,
  CreateSectionDto,
} from "../../services/sections.service";
import { UploadFrontendService } from "../../services/upload.service";
import {
  TeachersFrontendService,
  TeacherDto,
} from "../../services/teachers.service";
import { ChatFrontendService } from "../../services/chat.service";

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

  const [form, setForm] = useState({
    name: "",
    description: "",
    imageUrl: "",
    iconUrl: "",
    galleryDriveUrl: "",
    ageMin: 5,
    ageMax: 5,
    maxParticipants: 1,
    isActive: true,
    teacherIds: [] as string[],
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [iconFile, setIconFile] = useState<File | null>(null);

  // 👉 превью изображений
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    teachersService.findAll().then(setTeachers);
  }, []);

  const handleChange = (key: string, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const selectTeacher = (id: string) => {
    setForm((prev) => ({
      ...prev,
      teacherIds: [id],
    }));
  };

  // 👉 загрузка файла через backend
  const uploadIfNeeded = async (file: File | null) => {
    if (!file) return undefined;
    const uploaded: any = await uploadService.image(file);

    // сервер возвращает filename → формируем урл
    return uploadService.getFileUrl(uploaded.filename || uploaded.name);
  };

  // 👉 изображение секции + preview
  const handleImageSelect = (file: File | null) => {
    setImageFile(file);
    if (file) setImagePreview(URL.createObjectURL(file));
    else setImagePreview(null);
  };

  // 👉 иконка секции + preview
  const handleIconSelect = (file: File | null) => {
    setIconFile(file);
    if (file) setIconPreview(URL.createObjectURL(file));
    else setIconPreview(null);
  };

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!form.name.trim()) throw new Error("Название обязательно");
      if (!form.description.trim()) throw new Error("Описание обязательно");

      const imageUrl = await uploadIfNeeded(imageFile);
      const iconUrl = await uploadIfNeeded(iconFile);

      const payload: CreateSectionDto = { ...form };

      if (imageUrl) payload.imageUrl = imageUrl;
      if (iconUrl) payload.iconUrl = iconUrl;

      const created: any = await sectionsService.create(payload);

      // создаём чат секции
      await chatService.createChat({
        type: "SECTION",
        sectionId: created.id,
      });

      onClose();
    } catch (err: any) {
      setError(err.message || "Ошибка создания секции");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Создать секцию">
      <form onSubmit={create} className="space-y-4 text-white">
        {error && <div className="text-red-500">{error}</div>}

        {/* Название */}
        <div>
          <label className="block mb-1">Название</label>
          <input
            className="w-full bg-[#222] rounded px-3 py-2"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
          />
        </div>

        {/* Описание */}
        <div>
          <label className="block mb-1">Описание</label>
          <textarea
            className="w-full bg-[#222] rounded px-3 py-2"
            value={form.description}
            rows={3}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>

        {/* Галерея */}
        <div>
          <label className="block mb-1">Ссылка на Google Drive галерею</label>
          <input
            className="w-full bg-[#222] rounded px-3 py-2"
            value={form.galleryDriveUrl}
            onChange={(e) =>
              handleChange("galleryDriveUrl", e.target.value)
            }
          />
        </div>

        {/* Статус */}
        <div>
          <label className="block mb-1">Активна?</label>
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => handleChange("isActive", e.target.checked)}
          />
        </div>

        {/* Учителя */}
        <div>
          <label className="block mb-2">Учителя</label>
          <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto">
            {teachers.map((t) => (
              <button
                type="button"
                key={t.id}
                onClick={() => selectTeacher(t.id)}
                className={`flex items-center gap-3 p-2 rounded border ${
                  form.teacherIds[0] === t.id
                    ? "border-customyellow bg-customyellow/20"
                    : "border-white/10 bg-[#222]"
                }`}
              >
                <img
                  src={t.photoUrl}
                  className="w-12 h-12 rounded object-cover"
                />
                <span>
                  {t.lastName} {t.firstName}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Фото секции */}
        <div>
          <label className="block mb-1">Фото секции</label>
          <input
            type="file"
            onChange={(e) => handleImageSelect(e.target.files?.[0] ?? null)}
          />

          {imagePreview && (
            <img
              src={imagePreview}
              className="mt-2 w-32 h-32 rounded object-cover border border-white/20"
            />
          )}
        </div>

        {/* Иконка секции */}
        <div>
          <label className="block mb-1">Иконка секции</label>
          <input
            type="file"
            onChange={(e) => handleIconSelect(e.target.files?.[0] ?? null)}
          />

          {iconPreview && (
            <img
              src={iconPreview}
              className="mt-2 w-20 h-20 rounded object-cover border border-white/20"
            />
          )}
        </div>

        {/* Возраст и лимиты */}
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
              onChange={(e) =>
                handleChange("maxParticipants", Number(e.target.value))
              }
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-customyellow text-black rounded"
        >
          {loading ? "Создание..." : "Создать"}
        </button>
      </form>
    </BaseModal>
  );
}
