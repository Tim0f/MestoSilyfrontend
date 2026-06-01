import React, { useEffect, useState } from "react";
import BaseModal from "../ui/BaseModal";
import { Client } from "../../services/httpClient";
import { SectionsFrontendService } from "../../services/sections.service";
import { UploadFrontendService } from "../../services/upload.service";
import {
  TeachersFrontendService,
  type TeacherDto,
} from "../../services/teachers.service";
import { getPublicUrl } from "../../utils/publicUrl";

interface Props {
  id: string;
  isOpen: boolean;
  onClose: () => void;
}

const client = Client;

const sectionsService = new SectionsFrontendService(client);
const uploadService = new UploadFrontendService(client);
const teachersService = new TeachersFrontendService(client);

export default function SectionEditModal({ id, isOpen, onClose }: Props) {
  const [teachers, setTeachers] = useState<TeacherDto[]>([]);
  const [loading, setLoading] = useState(true);
  const resolvePreviewSrc = (value: string | null) => {
  if (!value) return undefined;

  // blob URL — отдаём как есть
  if (value.startsWith("blob:")) {
    return value;
  }

  // backend путь — нормализуем
  return getPublicUrl(value);
};


  const [form, setForm] = useState({
    name: "",
    description: "",
    imageUrl: null as string | null,
    iconUrl: null as string | null,
    galleryDriveUrl: "",
    ageMin: 5,
    ageMax: 5,
    maxParticipants: 1,
    isActive: true,
    teacherIds: [] as string[],
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [iconFile, setIconFile] = useState<File | null>(null);

  // ⚠️ preview хранит ЛИБО blob:, ЛИБО путь от backend
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) load();
  }, [id, isOpen]);

  const load = async () => {
    setLoading(true);

    const data: any = await sectionsService.findOne(id);
    const loadedTeachers = await teachersService.findAll();

    setTeachers(loadedTeachers);

    setForm({
      name: data.name ?? "",
      description: data.description ?? "",
      imageUrl: data.imageUrl ?? null,
      iconUrl: data.iconUrl ?? null,
      galleryDriveUrl: data.galleryDriveUrl ?? "",
      ageMin: data.ageMin,
      ageMax: data.ageMax,
      maxParticipants: data.maxParticipants,
      isActive: data.isActive,
      teacherIds: data.teachers?.map((t: any) => t.id) ?? [],
    });

    // ✅ backend возвращает путь, НЕ абсолютный URL
    setImagePreview(data.imageUrl ?? null);
    setIconPreview(data.iconUrl ?? null);

    setImageFile(null);
    setIconFile(null);

    setLoading(false);
  };

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const selectTeacher = (teacherId: string) => {
    setForm((prev) => ({
      ...prev,
      teacherIds: [teacherId],
    }));
  };

  const handleImageSelect = (file: File | null) => {
    setImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : form.imageUrl);
  };

  const handleIconSelect = (file: File | null) => {
    setIconFile(file);
    setIconPreview(file ? URL.createObjectURL(file) : form.iconUrl);
  };

  const uploadIfNeeded = async (file: File | null) => {
    if (!file) return undefined;
    const uploaded: any = await uploadService.image(file);
    return uploaded.filename || uploaded.name || uploaded.url;
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();

    const newImageUrl = await uploadIfNeeded(imageFile);
    const newIconUrl = await uploadIfNeeded(iconFile);

    await sectionsService.update(id, {
      ...form,
      imageUrl: newImageUrl ?? form.imageUrl,
      iconUrl: newIconUrl ?? form.iconUrl,
    });

    onClose();
  };

  if (!isOpen || loading) return null;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Редактировать секцию">
      <form onSubmit={save} className="space-y-4 text-customwhite">

        {/* Название */}
        <div>
          <label className="block mb-1">Название</label>
          <input
            className="w-full bg-[#222] rounded px-3 py-2"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>

        {/* Описание */}
        <div>
          <label className="block mb-1">Описание</label>
          <textarea
            className="w-full bg-[#222] rounded px-3 py-2"
            rows={3}
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>

        {/* Фото секции */}
        <div>
          <label className="block mb-1">Фото секции</label>

          {imagePreview && (
            <img
              src={resolvePreviewSrc(imagePreview)}
              className="w-32 h-32 rounded mb-2 object-cover border border-customwhite/20"
              alt=""
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              handleImageSelect(e.target.files?.[0] ?? null)
            }
          />
        </div>

        {/* Иконка секции */}
        <div>
          <label className="block mb-1">Иконка секции</label>

          {iconPreview && (
            <img
              src={resolvePreviewSrc(iconPreview)}
              className="w-20 h-20 rounded mb-2 object-cover border border-customwhite/20"
              alt=""
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              handleIconSelect(e.target.files?.[0] ?? null)
            }
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

        {/* Активность */}
        <div>
          <label className="block mb-1">Активна?</label>
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) =>
              handleChange("isActive", e.target.checked)
            }
          />
        </div>

        {/* Возраст и лимиты */}
        <div className="grid grid-cols-3 gap-2">
          <input
            type="number"
            className="bg-[#222] rounded px-3 py-2"
            value={form.ageMin}
            onChange={(e) => handleChange("ageMin", Number(e.target.value))}
          />
          <input
            type="number"
            className="bg-[#222] rounded px-3 py-2"
            value={form.ageMax}
            onChange={(e) => handleChange("ageMax", Number(e.target.value))}
          />
          <input
            type="number"
            className="bg-[#222] rounded px-3 py-2"
            value={form.maxParticipants}
            onChange={(e) =>
              handleChange("maxParticipants", Number(e.target.value))
            }
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
                    : "border-customwhite/10 bg-[#222]"
                }`}
              >
                <img
                  src={getPublicUrl(t.photoUrl)}
                  className="w-12 h-12 rounded object-cover"
                  alt=""
                />
                <span>
                  {t.lastName} {t.firstName}
                </span>
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-customyellow text-customblack rounded"
        >
          Сохранить изменения
        </button>
      </form>
    </BaseModal>
  );
}
