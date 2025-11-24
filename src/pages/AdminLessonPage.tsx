// AdminLessonsPage.tsx
// Страница управления уроками (Lessons)

import React, { useState } from 'react';
import LessonsList from '../components/lessons/LessonsList';
import LessonCreateModal from '../components/lessons/LessonCreateModal';
import LessonEditModal from '../components/lessons/LessonEditModal';

export default function AdminLessonsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  return (
    <div className="p-10 text-white space-y-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Уроки</h1>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-4 py-2 bg-yellow-500 text-black rounded font-semibold hover:bg-yellow-400"
        >
          Создать урок
        </button>
      </div>

      <LessonsList onEdit={(id) => setEditId(id)} />

      {/* Модалка создания урока */}
      <LessonCreateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      {/* Модалка редактирования урока */}
      {editId && (
        <LessonEditModal
          id={editId}
          onClose={() => setEditId(null)}
        />
      )}
    </div>
  );
}