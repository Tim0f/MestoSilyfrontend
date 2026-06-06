import { useState } from "react";
import { getAvatarUrl } from "../../utils/avatars"; // путь к вашей утилите

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    phone: string;
    avatarID: number;          // <-- добавлено
  }) => void;
  initial: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    phone?: string;
    avatarID?: number;         // <-- добавлено
  };
}

export default function ProfileEditModal({ open, onClose, onSave, initial }: Props) {
  const [form, setForm] = useState({
    firstName: initial.firstName || "",
    lastName: initial.lastName || "",
    dateOfBirth: initial.dateOfBirth || "",
    phone: initial.phone || "",
  });

  const [selectedAvatarId, setSelectedAvatarId] = useState<number>(
    initial.avatarID || 1
  );

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...form, avatarID: selectedAvatarId });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-customblack border border-customyellow/30 rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-xl font-h2 text-customyellow mb-4">Редактировать профиль</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Поля формы */}
          <input
            type="text"
            placeholder="Имя"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            className="bg-customblack border border-customyellow/30 rounded-xl px-4 py-2 text-customwhite"
            required
          />
          <input
            type="text"
            placeholder="Фамилия"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            className="bg-customblack border border-customyellow/30 rounded-xl px-4 py-2 text-customwhite"
            required
          />
          <input
            type="date"
            value={form.dateOfBirth}
            onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
            className="bg-customblack border border-customyellow/30 rounded-xl px-4 py-2 text-customwhite"
            required
          />
          <input
            type="tel"
            placeholder="Телефон"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="bg-customblack border border-customyellow/30 rounded-xl px-4 py-2 text-customwhite"
          />

          {/* Блок выбора аватарки */}
          <div>
            <label className="block text-customyellow text-sm mb-2">Аватарка</label>
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4, 5, 6, 7].map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSelectedAvatarId(id)}
                  className={`w-16 h-16 rounded-full overflow-hidden border-2 transition hover:scale-105 ${
                    selectedAvatarId === id
                      ? "border-customyellow"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={getAvatarUrl(id)}
                    alt={`Аватар ${id}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-customgrey text-customwhite font-h2 px-4 py-2 rounded-xl"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="bg-customyellow text-customblack font-h2 px-4 py-2 rounded-xl"
            >
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}