import React, { useEffect, useState } from "react";
import { HttpClient } from "../../services/httpClient";
import { UsersFrontendService } from "../../services/users.service";
import { GrainsFrontendService } from "../../services/grains.service";

import GrainsAddModal from "./GrainsAddModal";
import GrainsDeductModal from "./GrainsDeductModal";
import GrainsTransferModal from "./GrainsTransferModal";

interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

const client = new HttpClient({
  baseUrl:
    (import.meta.env.VITE_ADMIN_API_URL as string) ||
    (import.meta.env.VITE_API_URL as string) ||
    "http://localhost:3000/api",
  getToken: () => localStorage.getItem("token") ?? undefined,
});

const usersService = new UsersFrontendService(client);
const grainsService = new GrainsFrontendService(client);

export default function GrainManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [addOpen, setAddOpen] = useState(false);
  const [deductOpen, setDeductOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);

  const fetchUsers = async () => {
    const data = (await usersService.findAll()) as User[];
setUsers(data);

  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Управление зёрнами</h1>

      {/* Таблица пользователей */}
      <table className="w-full border-collapse border border-white/10">
        <thead>
          <tr className="bg-[#222]">
            <th className="p-2 border border-white/10">Имя</th>
            <th className="p-2 border border-white/10">Email</th>
            <th className="p-2 border border-white/10">Телефон</th>
            <th className="p-2 border border-white/10">Действия</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border border-white/10">
              <td className="p-2">
                {u.firstName} {u.lastName}
              </td>
              <td className="p-2">{u.email}</td>
              <td className="p-2">{u.phone}</td>
              <td className="p-2 flex gap-2">
                <button
                  onClick={() => {
                    setSelectedUser(u);
                    setAddOpen(true);
                  }}
                  className="px-3 py-1 bg-green-600 rounded"
                >
                  + Начислить
                </button>

                <button
                  onClick={() => {
                    setSelectedUser(u);
                    setDeductOpen(true);
                  }}
                  className="px-3 py-1 bg-red-600 rounded"
                >
                  – Списать
                </button>

                <button
                  onClick={() => {
                    setSelectedUser(u);
                    setTransferOpen(true);
                  }}
                  className="px-3 py-1 bg-yellow-600 rounded"
                >
                  ⇄ Перевести
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* МОДАЛКИ */}
      {selectedUser && (
        <>
          <GrainsAddModal
            isOpen={addOpen}
            onClose={() => setAddOpen(false)}
            userId={selectedUser.id}
          />

          <GrainsDeductModal
            isOpen={deductOpen}
            onClose={() => setDeductOpen(false)}
            userId={selectedUser.id}
          />

          <GrainsTransferModal
            isOpen={transferOpen}
            onClose={() => setTransferOpen(false)}
            fromUser={selectedUser}
          />
        </>
      )}
    </div>
  );
}
