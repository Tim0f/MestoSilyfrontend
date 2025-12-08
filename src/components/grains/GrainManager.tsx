import React, { useEffect, useState } from 'react';
import { UsersFrontendService } from '../../services/users.service';
import { Client } from '../../services/httpClient';
import GrainsAddModal from './GrainsAddModal';
import GrainsRemoveModal from './GrainsRemoveModal';
import GrainsTransferModal from './GrainsTransferModal';
import GrainsHistoryModal  from './GrainsHistoryModal';
import { User } from '../../types/User';

const client = Client

const usersService = new UsersFrontendService(client);

export default function GrainManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [filtered, setFiltered] = useState<User[]>([]);
  const [search, setSearch] = useState('');

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [modalAdd, setModalAdd] = useState(false);
  const [modalRemove, setModalRemove] = useState(false);
  const [modalTransfer, setModalTransfer] = useState(false);
  const [modalHistory, setModalHistory] = useState(false);

  const loadUsers = async () => {
    try {
      const res: any = await usersService.findAll();
      const data = res?.data ?? res;
      if (Array.isArray(data)) {
        setUsers(data as User[]);
        setFiltered(data as User[]);
      }
    } catch (e) {
      console.error('Ошибка загрузки пользователей', e);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(users);
    } else {
      const s = search.toLowerCase();
      setFiltered(
        users.filter(
          (u) =>
            `${u.firstName} ${u.lastName}`.toLowerCase().includes(s) ||
            u.email.toLowerCase().includes(s)
        )
      );
    }
  }, [search, users]);

  const openAdd = (id: string) => {
    setSelectedUserId(id);
    setModalAdd(true);
  };

  const openRemove = (id: string) => {
    setSelectedUserId(id);
    setModalRemove(true);
  };

  const openTransfer = (id: string) => {
    setSelectedUserId(id);
    setModalTransfer(true);
  };

  const openHistory = (id: string) => {
    setSelectedUserId(id);
    setModalHistory(true);
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Управление зернами</h1>

      <input
        className="px-3 py-2 bg-[#222] rounded border border-white/10 w-full mb-4"
        placeholder="Поиск пользователя..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="space-y-3">
        {filtered.map((user) => (
          <div
            key={user.id}
            className="bg-[#111] p-4 rounded border border-white/10 flex justify-between items-center"
          >
            <div>
              <div className="font-bold text-lg">
                {user.firstName} {user.lastName}
              </div>
              <div className="text-gray-400 text-sm">{user.email}</div>
            </div>

            <div className="flex gap-2">
              <button
                className="px-3 py-1 bg-green-600 rounded"
                onClick={() => openAdd(user.id)}
              >
                Начислить
              </button>

              <button
                className="px-3 py-1 bg-red-600 rounded"
                onClick={() => openRemove(user.id)}
              >
                Списать
              </button>

              <button
                className="px-3 py-1 bg-yellow-500 text-black rounded"
                onClick={() => openTransfer(user.id)}
              >
                Перевести
              </button>

              <button
                className="px-3 py-1 bg-blue-600 rounded"
                onClick={() => openHistory(user.id)}
              >
                История
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ADD */}
      <GrainsAddModal
        isOpen={modalAdd}
        onClose={() => setModalAdd(false)}
        userId={selectedUserId ?? ''}
        onUpdated={loadUsers}
      />

      {/* REMOVE */}
      <GrainsRemoveModal
        isOpen={modalRemove}
        onClose={() => setModalRemove(false)}
        userId={selectedUserId ?? ''}
        onUpdated={loadUsers}
      />

      {/* TRANSFER */}
      <GrainsTransferModal
        isOpen={modalTransfer}
        onClose={() => setModalTransfer(false)}
        fromUserId={selectedUserId ?? undefined}
        onUpdated={loadUsers}
      />

      {/* HISTORY */}
      <GrainsHistoryModal
        isOpen={modalHistory}
        onClose={() => setModalHistory(false)}
        userId={selectedUserId ?? ''}
      />
    </div>
  );
}
