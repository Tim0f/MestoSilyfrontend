// UsersList.tsx
// Список пользователей с кнопками редактирования и удаления

import  { useEffect, useState } from 'react';
import { Client } from '../../services/httpClient';
import { UsersFrontendService } from '../../services/users.service';

interface UserItem {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  dateOfBirth: string;
  role: 'USER' | 'ADMIN' | 'ROOT';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  onEdit: (id: string) => void;
}

const client = Client

const usersService = new UsersFrontendService(client);

export default function UsersList({ onEdit }: Props) {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data: any = await usersService.findAll();
      setUsers(data);
    } catch (err: any) {
      setError(err.message ?? 'Ошибка загрузки пользователей');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить пользователя?')) return;

    try {
      await usersService.remove(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err: any) {
      alert(err.message ?? 'Ошибка удаления');
    }
  };

  if (loading)
    return <p className="text-customwhite">Загрузка...</p>;

  if (error)
    return <p className="text-[#FF6B4A]">{error}</p>;

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <div
          key={user.id}
          className="flex justify-between items-center bg-customgrey border border-customwhite/10 px-5 py-4 rounded-xl"
        >
          <div className="space-y-1">
            <p className="text-lg font-semibold">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-gray-400 text-sm">{user.email}</p>
            <p className="text-gray-400 text-sm">Роль: {user.role}</p>
            <p className="text-gray-400 text-sm">
              Статус: {user.isActive ? 'Активен' : 'Неактивен'}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => onEdit(user.id)}
              className="px-4 py-2 bg-[#5BC0EB] text-customblack rounded hover:bg-blue-400"
            >
              Редактировать
            </button>

            <button
              onClick={() => handleDelete(user.id)}
              className="px-4 py-2 bg-red-500 text-customblack rounded hover:bg-[#FF6B4A]"
            >
              Удалить
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}