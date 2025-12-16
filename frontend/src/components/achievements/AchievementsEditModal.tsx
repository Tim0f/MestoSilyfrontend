import React, { useState } from 'react';
import { Client } from '../../services/httpClient';
import {
  AchievementsFrontendService,
  type UpdateAchievementDto,
} from '../../services/achievements.service';
import { UploadFrontendService } from '../../services/upload.service';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  achievement: {
    id: string;
    name: string;
    description: string;
    iconUrl: string;
    rewardGrains: number;
    sectionId: string;
    isActive: boolean;
  };
  sections: { id: string; name: string }[];
}

const client = Client;
const uploadService = new UploadFrontendService(client);

const achievementsService = new AchievementsFrontendService(client);

export default function AchievementEditModal({
  isOpen,
  onClose,
  achievement,
  sections,
}: Props) {
  const [form, setForm] = useState<UpdateAchievementDto>({
    name: achievement.name,
    description: achievement.description,
    iconUrl: achievement.iconUrl,
    rewardGrains: achievement.rewardGrains,
    sectionId: achievement.sectionId,
    isActive: achievement.isActive,
  });
const [uploadingIcon, setUploadingIcon] = useState(false);

  const update = (k: keyof UpdateAchievementDto, v: any) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();

    await achievementsService.update(achievement.id, form);
    onClose();
  };

const uploadIcon = async (file: File) => {
  setUploadingIcon(true);

  try {
    const res = await uploadService.image<{ filename: string }>(file);
    const iconUrl = uploadService.getFileUrl(res.filename);

    update('iconUrl', iconUrl);
  } catch (e) {
    console.error('Ошибка загрузки иконки', e);
    alert('Не удалось загрузить иконку');
  } finally {
    setUploadingIcon(false);
  }
};


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-customgrey border border-white/10 rounded-xl p-6 w-full max-w-lg text-white">
        <h2 className="text-xl font-bold mb-4">Редактировать ачивку</h2>

        <form onSubmit={save} className="space-y-4">
          <div>
            <label className="block mb-1 text-customwhite">Название</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              className="w-full bg-[#222] border border-white/10 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 text-customwhite">Описание</label>
            <textarea
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              className="w-full bg-[#222] border border-white/10 rounded px-3 py-2"
              rows={3}
            />
          </div>

          <div>
  <label className="block mb-1 text-customwhite">Иконка</label>

  {/* Предпросмотр текущей иконки */}
  {form.iconUrl && (
    <div className="mb-2">
      <img
        src={form.iconUrl}
        alt="icon preview"
        className="w-16 h-16 object-contain rounded bg-[#111]"
      />
    </div>
  )}

  {/* Загрузка новой */}
  <input
    type="file"
    accept="image/*"
    onChange={(e) => {
      const file = e.target.files?.[0];
      if (file) uploadIcon(file);
    }}
    className="w-full bg-[#222] border border-white/10 rounded px-3 py-2"
  />

  {uploadingIcon && (
    <p className="text-sm text-customyellow mt-1">
      Загружаем новую иконку...
    </p>
  )}

  {form.iconUrl && !uploadingIcon && (
    <p className="text-xs text-gray-400 mt-1">
      Выберите файл, чтобы заменить текущую иконку
    </p>
  )}
</div>


          <div>
            <label className="block mb-1 text-customwhite">Награда (зерна)</label>
            <input
              type="number"
              value={form.rewardGrains}
              onChange={(e) => update('rewardGrains', Number(e.target.value))}
              className="w-full bg-[#222] border border-white/10 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 text-customwhite">Раздел</label>
<select
  value={form.sectionId ?? ""}
  onChange={(e) => update('sectionId', e.target.value)}
  className="w-full bg-[#222] border border-white/10 rounded px-3 py-2"
>
              {sections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => update('isActive', e.target.checked)}
              />
              Активна
            </label>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-customyellow text-black rounded hover:bg-customyellow"
            >
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
