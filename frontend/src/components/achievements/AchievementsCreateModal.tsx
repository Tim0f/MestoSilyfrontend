import React, { useState } from 'react';
import {Client} from '../../services/httpClient';
import { UploadFrontendService } from '../../services/upload.service';
import {
  AchievementsFrontendService,
  type CreateAchievementDto,
} from '../../services/achievements.service';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  sections: { id: string; name: string }[];
}


const client = Client;

const achievementsService = new AchievementsFrontendService(client);

// 🔥 генерация кода
function generateAchievementCode() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

export default function AchievementCreateModal({
  isOpen,
  onClose,
  sections,
}: Props) {
  const [form, setForm] = useState<CreateAchievementDto>({
    name: '',
    description: '',
    iconUrl: '',
    rewardGrains: 0,
    sectionId: '',
    isActive: true,
  });
const uploadService = new UploadFrontendService(client);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  const [creating, setCreating] = useState(false);
const [uploadingIcon, setUploadingIcon] = useState(false);

  const update = (k: keyof CreateAchievementDto, v: any) =>
    setForm((p) => ({ ...p, [k]: v }));

  // 🧪 Проверяем код на уникальность
const checkUniqueCode = async (code: string): Promise<boolean> => {
  // Загружаем ВСЕ ачивки (активные)
  const achievements: any[] = await achievementsService.findAll();

  // Проверяем, нет ли ачивки с таким кодом
  return !achievements.some(a => a.code === code);
};

const uploadIcon = async (file: File) => {
  setUploadingIcon(true);
  try {
    const filename = await uploadService.image(file);
    update('iconUrl', filename);
  } catch (e) {
    console.error('Ошибка загрузки иконки', e);
    alert('Не удалось загрузить иконку');
  } finally {
    setUploadingIcon(false);
  }
};



  // 🔄 Генерация уникального кода
  const generateUniqueCode = async (): Promise<string> => {
    setChecking(true);

    for (let i = 0; i < 10; i++) {
      const code = generateAchievementCode();
      const isUnique = await checkUniqueCode(code);
      if (isUnique) {
        setChecking(false);
        return code;
      }
    }

    setChecking(false);
    throw new Error("Не удалось сгенерировать уникальный код");
  };

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      // Генерируем УНИКАЛЬНЫЙ код
      const code = await generateUniqueCode();
      setGeneratedCode(code);

      const payload = {
        ...form,
        code,
      };

      await achievementsService.create(payload);

      onClose();
    } catch (err) {
      console.error("Ошибка создания ачивки:", err);
      alert("Ошибка создания ачивки. Попробуйте ещё раз.");
    } finally {
      setCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-customgrey border border-white/10 rounded-xl p-6 w-full max-w-lg text-white">
        <h2 className="text-xl font-bold mb-4">Создать ачивку</h2>

        <form onSubmit={create} className="space-y-4">
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
    <p className="text-sm text-customyellow mt-1">Загружаем иконку...</p>
  )}

  {form.iconUrl && (
    <img
      src={form.iconUrl}
      alt="icon preview"
      className="mt-2 w-16 h-16 object-contain rounded bg-[#111]"
    />
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
              value={form.sectionId ?? ''}
              onChange={(e) => update('sectionId', e.target.value)}
              className="w-full bg-[#222] border border-white/10 rounded px-3 py-2"
            >
              <option value="">Выберите раздел</option>
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

          {checking && (
            <div className="p-2 rounded bg-[#1b1b1b] text-customyellow text-sm">
              Проверяем уникальность кода...
            </div>
          )}

          {generatedCode && (
            <div className="p-3 rounded bg-[#1b1b1b] border border-white/10">
              <p className="text-sm text-customwhite">Сгенерированный уникальный код:</p>
              <p className="font-bold text-customyellow text-lg">{generatedCode}</p>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
              disabled={creating || checking}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-customyellow text-black rounded hover:bg-customyellow"
              disabled={creating || checking}
            >
              {creating ? "Создаём..." : "Создать"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
