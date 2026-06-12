import { FC } from "react";

interface AchievementCodeModalProps {
  open: boolean;
  code: string;
  onChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  error?: string | null;
  success?: boolean;
}

const AchievementCodeModal: FC<AchievementCodeModalProps> = ({
  open,
  code,
  onChange,
  onClose,
  onSubmit,
  error,
  success,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-customblack z-50">
      <div className="bg-customblack p-6 rounded-xl w-96 relative">
        <button
          className="absolute top-2 right-2 text-customyellow font-bold"
          onClick={onClose}
        >
          ×
        </button>

        <h2 className="text-2xl font-h1 mb-4 text-customyellow">
          Введите код достижения
        </h2>

        <input
          type="text"
          value={code}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Введите код"
          className="w-full p-2 rounded-lg text-customblack mb-4"
        />

        {error && <p className="text-red-500 mb-2">{error}</p>}
        {success && <p className="text-green-500 mb-2">Достижение получено!</p>}

        <button
          onClick={onSubmit}
          disabled={!code.trim() || success}
          className="bg-customyellow text-customblack px-6 py-2 rounded-xl hover:brightness-90 disabled:opacity-50"
        >
          Получить
        </button>
      </div>
    </div>
  );
};

export default AchievementCodeModal;