import React, { useEffect, useState } from "react";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    galleryDriveUrl: "",
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
    const uploaded: any = await uploadService.image(file);
    return uploadService.getFileUrl(uploaded.filename || uploaded.name);
  };

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const imageUrl = await uploadIfNeeded(imageFile);
      const iconUrl = await uploadIfNeeded(iconFile);

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
      };

      if (imageUrl) payload.imageUrl = imageUrl;
      if (iconUrl) payload.iconUrl = iconUrl;

      const created: any = await sectionsService.create(payload);

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
            rows={3}
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1">Ссылка на галерею (Google Drive)</label>
          <input
            className="w-full bg-[#222] rounded px-3 py-2"
            value={form.galleryDriveUrl}
            onChange={(e) =>
              handleChange("galleryDriveUrl", e.target.value)
            }
          />
        </div>

        <div>
          <label className="block mb-1">Цена одного занятия</label>
          <input
            type="number"
            min={0}
            className="w-full bg-[#222] rounded px-3 py-2"
            value={form.price}
            onChange={(e) => handleChange("price", Number(e.target.value))}
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block mb-1">Возраст от</label>
            <input
              type="number"
              className="w-full bg-[#222] rounded px-3 py-2"
              value={form.ageMin}
              onChange={(e) => handleChange("ageMin", Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block mb-1">Возраст до</label>
            <input
              type="number"
              className="w-full bg-[#222] rounded px-3 py-2"
              value={form.ageMax}
              onChange={(e) => handleChange("ageMax", Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block mb-1">Макс. участников</label>
            <input
              type="number"
              className="w-full bg-[#222] rounded px-3 py-2"
              value={form.maxParticipants ?? ""}
              onChange={(e) =>
                handleChange(
                  "maxParticipants",
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
            />
          </div>
        </div>

        <div>
          <label className="block mb-1">Активна</label>
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => handleChange("isActive", e.target.checked)}
          />
        </div>

        <div>
          <label className="block mb-2">Учитель</label>
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

        <div>
          <label className="block mb-1">Фото секции</label>
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
            <img
              src={imagePreview}
              className="mt-2 w-32 rounded border"
            />
          )}
        </div>

        <div>
          <label className="block mb-1">Иконка секции</label>
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
            <img
              src={iconPreview}
              className="mt-2 w-20 rounded border"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-customyellow text-black rounded px-4 py-2"
        >
          {loading ? "Создание..." : "Создать"}
        </button>
      </form>
    </BaseModal>
  );
}
