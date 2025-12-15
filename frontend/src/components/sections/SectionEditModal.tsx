import React, { useEffect, useState } from "react";
import BaseModal from "../ui/BaseModal";
import { Client } from "../../services/httpClient";
import { SectionsFrontendService } from "../../services/sections.service";
import { UploadFrontendService } from "../../services/upload.service";
import {
  TeachersFrontendService,
  type TeacherDto,
} from "../../services/teachers.service";

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

  // NEW — Preview states
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, [id]);

  const load = async () => {
    const data: any = await sectionsService.findOne(id);
    const loadedTeachers = await teachersService.findAll();

    setTeachers(loadedTeachers);

    setForm({
      name: data.name,
      description: data.description,
      imageUrl: data.imageUrl,
      iconUrl: data.iconUrl,
      galleryDriveUrl: data.galleryDriveUrl ?? "",
      ageMin: data.ageMin,
      ageMax: data.ageMax,
      maxParticipants: data.maxParticipants,
      isActive: data.isActive,
      teacherIds: data.teachers?.map((t: any) => t.id) ?? [],
    });

    setLoading(false);
  };

  const handleChange = (k: string, v: any) =>
    setForm((p) => ({ ...p, [k]: v }));

  const selectTeacher = (id: string) => {
    setForm((p) => ({
      ...p,
      teacherIds: [id], // всегда один
    }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleIconSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setIconFile(file);
    if (file) {
      setIconPreview(URL.createObjectURL(file));
    }
  };

  const uploadIfNeeded = async (file: File | null) => {
    if (!file) return undefined;
    const uploaded = await uploadService.image(file);
    return (uploaded as any).url;
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();

    const newImage = await uploadIfNeeded(imageFile);
    const newIcon = await uploadIfNeeded(iconFile);

    await sectionsService.update(id, {
      ...form,
      imageUrl: newImage ?? form.imageUrl,
      iconUrl: newIcon ?? form.iconUrl,
    });

    onClose();
  };

  if (loading) return null;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Редактировать секцию">
      <form onSubmit={save} className="space-y-4 text-white">

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
            value={form.description}
            rows={3}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>

        {/* Фото секции */}
        <div>
          <label className="block mb-1">Фото секции</label>

          {/* Preview or current */}
          {imagePreview ? (
            <img src={imagePreview} className="w-32 rounded mb-2" />
          ) : form.imageUrl ? (
            <img src={form.imageUrl} className="w-32 rounded mb-2" />
          ) : null}

          <input
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
          />
        </div>

        {/* Иконка */}
        <div>
          <label className="block mb-1">Иконка секции</label>

          {/* Preview or current */}
          {iconPreview ? (
            <img src={iconPreview} className="w-20 rounded mb-2" />
          ) : form.iconUrl ? (
            <img src={form.iconUrl} className="w-20 rounded mb-2" />
          ) : null}

          <input
            type="file"
            accept="image/*"
            onChange={handleIconSelect}
          />
        </div>

        {/* Галерея */}
        <div>
          <label className="block mb-1">Ссылка на галерею</label>
          <input
            className="w-full bg-[#222] rounded px-3 py-2"
            value={form.galleryDriveUrl}
            onChange={(e) => handleChange("galleryDriveUrl", e.target.value)}
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

        {/* Возраст и лимиты */}
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block mb-1">Возраст мин.</label>
            <input
              type="number"
              className="w-full bg-[#222] rounded px-3 py-2"
              value={form.ageMin}
              onChange={(e) => handleChange("ageMin", Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block mb-1">Возраст макс.</label>
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
              value={form.maxParticipants}
              onChange={(e) =>
                handleChange("maxParticipants", Number(e.target.value))
              }
            />
          </div>
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

        <button
          type="submit"
          className="w-full px-4 py-2 bg-customyellow text-black rounded hover:bg-customyellow"
        >
          Сохранить изменения
        </button>
      </form>
    </BaseModal>
  );
}
