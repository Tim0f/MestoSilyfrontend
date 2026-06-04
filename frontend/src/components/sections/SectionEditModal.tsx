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

interface GalleryImage {
  id: string;
  imageUrl: string;
  position: number;
}

export default function SectionEditModal({ id, isOpen, onClose }: Props) {
  const [teachers, setTeachers] = useState<TeacherDto[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    description: "",
    iconUrl: null as string | null,
    galleryDriveUrl: "",
    ageMin: 5,
    ageMax: 5,
    maxParticipants: 1,
    isActive: true,
    teacherIds: [] as string[],
  });

  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);

  const [existingImages, setExistingImages] = useState<GalleryImage[]>([]);
  const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([]);
  const [newGalleryPreviews, setNewGalleryPreviews] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) load();
  }, [id, isOpen]);

  const load = async () => {
    setLoading(true);
    const data: any = await sectionsService.findOne(id);
    const loadedTeachers = await teachersService.findAll();
    const images: GalleryImage[] = await sectionsService.getImages(id);

    setTeachers(loadedTeachers);

    setForm({
      name: data.name ?? "",
      description: data.description ?? "",
      iconUrl: data.iconUrl ?? null,
      galleryDriveUrl: data.galleryDriveUrl ?? "",
      ageMin: data.ageMin,
      ageMax: data.ageMax,
      maxParticipants: data.maxParticipants,
      isActive: data.isActive,
      teacherIds: data.teachers?.map((t: any) => t.id) ?? [],
    });

    setIconPreview(data.iconUrl ?? null);
    setIconFile(null);

    setExistingImages(images);
    setNewGalleryFiles([]);
    setNewGalleryPreviews([]);

    setLoading(false);
  };

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const selectTeacher = (teacherId: string) => {
    setForm((prev) => ({ ...prev, teacherIds: [teacherId] }));
  };

  const handleIconSelect = (file: File | null) => {
    setIconFile(file);
    setIconPreview(file ? URL.createObjectURL(file) : form.iconUrl);
  };

  const handleNewGallerySelect = (files: FileList | null) => {
    if (!files) return;
    const fileArray = Array.from(files);
    setNewGalleryFiles((prev) => [...prev, ...fileArray]);
    setNewGalleryPreviews((prev) => [
      ...prev,
      ...fileArray.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const removeNewGalleryItem = (index: number) => {
    setNewGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setNewGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const deleteExistingImage = async (imageId: string) => {
    try {
      await sectionsService.deleteImage(imageId);
      setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch (err) {
      console.error("Ошибка удаления изображения", err);
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();

    // Если меняли иконку, загружаем её через uploadService, потом применим в update
    let newIconUrl: string | null | undefined;
    if (iconFile) {
      const uploaded = await uploadService.image(iconFile);
      newIconUrl = uploaded.filename;
    }

    // 1. Добавляем новые файлы в галерею через addImageFromFile
    if (newGalleryFiles.length > 0) {
      const maxPosition = existingImages.reduce(
        (max, img) => Math.max(max, img.position),
        0
      );
      await Promise.all(
        newGalleryFiles.map((file, i) =>
          sectionsService.addImageFromFile(id, file, maxPosition + i + 1)
        )
      );
    }

    // 2. Получаем обновлённый список изображений
    const updatedImages: GalleryImage[] = await sectionsService.getImages(id);

    // 3. Основное фото – первое из галереи (только имя файла)
    let mainImageUrl: string | null = null;
    if (updatedImages.length > 0) {
      const fullUrl = updatedImages[0].imageUrl;
      mainImageUrl = fullUrl.split('/').pop() ?? fullUrl;
    }

    // 4. Обновляем секцию
    await sectionsService.update(id, {
      name: form.name,
      description: form.description,
      galleryDriveUrl: form.galleryDriveUrl,
      ageMin: form.ageMin,
      ageMax: form.ageMax,
      maxParticipants: form.maxParticipants,
      isActive: form.isActive,
      teacherIds: form.teacherIds.length ? form.teacherIds : undefined,
      imageUrl: mainImageUrl,
      iconUrl: newIconUrl !== undefined ? newIconUrl : form.iconUrl,
    } as any);

    onClose();
  };

  if (!isOpen || loading) return null;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Редактировать секцию">
      <form onSubmit={save} className="space-y-4 text-customwhite">
        <div>
          <label className="block mb-1">Название</label>
          <input
            className="w-full bg-customblack rounded px-3 py-2"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1">Описание</label>
          <textarea
            className="w-full bg-customblack rounded px-3 py-2"
            rows={3}
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1">Иконка</label>
          {iconPreview && (
            <img
              src={
                iconPreview?.startsWith("blob")
                  ? iconPreview
                  : getPublicUrl(iconPreview)
              }
              className="w-20 h-20 rounded mb-2 object-cover border border-customwhite/20"
              alt=""
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleIconSelect(e.target.files?.[0] ?? null)}
          />
        </div>

        <div>
          <label className="block mb-1">
            Галерея (первое изображение — главное)
          </label>

          {existingImages.length > 0 ? (
            <div className="flex flex-wrap gap-2 mb-2">
              {existingImages.map((img) => (
                <div key={img.id} className="relative">
                  <img
                    src={getPublicUrl(img.imageUrl)}
                    className="w-20 h-20 object-cover rounded"
                    alt=""
                  />
                  <button
                    type="button"
                    onClick={() => deleteExistingImage(img.id)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 mb-2">Нет изображений</p>
          )}

          {newGalleryPreviews.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {newGalleryPreviews.map((src, idx) => (
                <div key={idx} className="relative">
                  <img src={src} className="w-20 h-20 object-cover rounded" alt="" />
                  <button
                    type="button"
                    onClick={() => removeNewGalleryItem(idx)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleNewGallerySelect(e.target.files)}
          />
        </div>

        <div>
          <label className="block mb-1">Ссылка на Google Drive галерею</label>
          <input
            className="w-full bg-customblack rounded px-3 py-2"
            value={form.galleryDriveUrl}
            onChange={(e) => handleChange("galleryDriveUrl", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block mb-1 text-sm">Мин. возраст</label>
            <input
              type="number"
              className="w-full bg-customblack rounded px-3 py-2"
              value={form.ageMin}
              onChange={(e) => handleChange("ageMin", Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">Макс. возраст</label>
            <input
              type="number"
              className="w-full bg-customblack rounded px-3 py-2"
              value={form.ageMax}
              onChange={(e) => handleChange("ageMax", Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">Макс. участников</label>
            <input
              type="number"
              className="w-full bg-customblack rounded px-3 py-2"
              value={form.maxParticipants}
              onChange={(e) =>
                handleChange("maxParticipants", Number(e.target.value))
              }
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => handleChange("isActive", e.target.checked)}
          />
          <label>Активна?</label>
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
                    : "border-customwhite/10 bg-customblack"
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