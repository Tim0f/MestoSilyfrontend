import React, { useEffect, useState } from "react";
import BaseModal from "../ui/BaseModal";
import { HttpClient } from "../../services/httpClient";
import { SectionsFrontendService } from "../../services/sections.service";
import { UploadFrontendService } from "../../services/upload.service";
import {
  TeachersFrontendService,
  type TeacherDto,
} from "../../services/teachers.service";

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
const teachersService = new TeachersFrontendService(client);

export default function SectionCreateModal({ isOpen, onClose }: Props) {
  const [teachers, setTeachers] = useState<TeacherDto[]>([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    imageUrl: "",
    iconUrl: "",
    galleryDriveUrl: "",
    ageMin: 0,
    ageMax: 0,
    maxParticipants: 0,
    isActive: true,
    teacherIds: [] as string[],
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [iconFile, setIconFile] = useState<File | null>(null);

  useEffect(() => {
    teachersService.findAll().then(setTeachers);
  }, []);

  const handleChange = (k: string, v: any) => {
    setForm((p) => ({ ...p, [k]: v }));
  };

  const toggleTeacher = (id: string) => {
    setForm((p) => ({
      ...p,
      teacherIds: p.teacherIds.includes(id)
        ? p.teacherIds.filter((t) => t !== id)
        : [...p.teacherIds, id],
    }));
  };

  const uploadIfNeeded = async (file: File | null): Promise<string | undefined> => {
    if (!file) return undefined;
    const uploaded = await uploadService.image(file);
    return (uploaded as any).url;
  };

  const create = async (e: React.FormEvent) => {
    e.preventDefault();

    const imageUrl = await uploadIfNeeded(imageFile);
    const iconUrl = await uploadIfNeeded(iconFile);

    await sectionsService.create({
      ...form,
      imageUrl: imageUrl ?? form.imageUrl,
      iconUrl: iconUrl ?? form.iconUrl,
    });

    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Создать секцию">
      <form onSubmit={create} className="space-y-4 text-white">
        
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

        {/* IMAGE UPLOAD */}
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

        {/* TEACHERS SELECT */}
        <div>
          <label className="block mb-2">Учителя</label>
          <div className="grid grid-cols-2 gap-3">
            {teachers.map((t) => (
              <button
                type="button"
                key={t.id}
                onClick={() => toggleTeacher(t.id)}
                className={`flex items-center gap-3 p-2 rounded border 
                ${form.teacherIds.includes(t.id)
                    ? "border-yellow-500 bg-yellow-500/20"
                    : "border-white/10 bg-[#222]"
                }`}
              >
                <img
                  src={t.photoUrl}
                  className="w-12 h-12 rounded object-cover"
                />
                <span>{t.lastName} {t.firstName}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-400"
        >
          Создать
        </button>
      </form>
    </BaseModal>
  );
}
