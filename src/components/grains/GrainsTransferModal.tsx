import React, { useState } from "react";
import { HttpClient } from "../../services/httpClient";
import { GrainsFrontendService } from "../../services/grains.service";
import UserSearchInput from "./UserSearchInput";

interface GrainsUser {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  fromUser: GrainsUser;
}

const client = new HttpClient({
  baseUrl:
    (import.meta.env.VITE_ADMIN_API_URL as string) ||
    (import.meta.env.VITE_API_URL as string) ||
    "http://localhost:3000/api",
  getToken: () => localStorage.getItem("token") ?? undefined,
});

const grainsService = new GrainsFrontendService(client);

export default function GrainsTransferModal({
  isOpen,
  onClose,
  fromUser,
}: Props) {
  const [toUser, setToUser] = useState<GrainsUser | null>(null);
  const [amount, setAmount] = useState(0);
  const [message, setMessage] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!toUser) return;

    await grainsService.transfer({
      toUserId: toUser.id,
      toUserEmail: toUser.email || "",
      amount,
      message,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#111] border border-white/10 p-6 rounded-xl w-full max-w-lg text-white">
        <h2 className="text-xl font-bold mb-4">Перевести зёрна</h2>

        {/* От кого */}
        <div className="mb-4 p-3 bg-[#1a1a1a] border border-white/10 rounded">
          <div className="text-gray-400 text-sm">От пользователя:</div>
          <div className="text-lg">
            {fromUser.firstName} {fromUser.lastName}
          </div>
          <div className="text-gray-400 text-sm">{fromUser.email}</div>
        </div>

        {/* Кому */}
        <div className="mb-4">
          <label className="block mb-1 text-gray-300">Кому перевести</label>
          <UserSearchInput onSelect={(u) => setToUser(u)} />
        </div>

        {/* Сумма */}
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-300">Количество</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-3 py-2 bg-[#222] border border-white/10 rounded"
              required
            />
          </div>

          {/* Сообщение */}
          <div>
            <label className="block mb-1 text-gray-300">Сообщение</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 bg-[#222] border border-white/10 rounded"
              rows={3}
              required
            />
          </div>

          {/* Кнопки */}
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
              className="px-4 py-2 bg-yellow-500 text-black font-semibold rounded hover:bg-yellow-400"
            >
              Перевести
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
