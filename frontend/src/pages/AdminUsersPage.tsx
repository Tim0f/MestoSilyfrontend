// AdminUsersPage.tsx
// Страница управления пользователями

import  { useState, lazy, Suspense } from 'react';

import UsersList from '../components/users/UserList';
const AdminCreateModal = lazy(() => import('../components/users/AdminCreateModal'));
const UserEditModal = lazy(() => import('../components/users/UserEditModal'));




export default function AdminUsersPage() {
  const [isCreateAdminOpen, setIsCreateAdminOpen] = useState(false);
  const [editUserId, setEditUserId] = useState<string | null>(null);

  return (
    <div className="p-10 text-customwhite space-y-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Пользователи</h1>
        <button
          onClick={() => setIsCreateAdminOpen(true)}
          className="px-4 py-2 bg-customyellow text-customblack rounded font-semibold hover:bg-customyellow"
        >
          Создать администратора
        </button>
      </div>
      <UsersList onEdit={(id) => setEditUserId(id)} />
    <Suspense fallback={null}>

      {/* Модалка создания администратора */}
      <AdminCreateModal
        isOpen={isCreateAdminOpen}
        onClose={() => setIsCreateAdminOpen(false)}
      />

      {/* Модалка редактирования пользователя */}
      {editUserId && (
        <UserEditModal
          id={editUserId}
          onClose={() => setEditUserId(null)}
        />
      )}

    </Suspense>

    </div>
  );
}
