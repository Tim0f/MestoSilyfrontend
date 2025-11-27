// AdminLessonsPage.tsx

import React, { useState } from "react";
import LessonsList from "../components/lessons/LessonsList";
import LessonCreateModal from "../components/lessons/LessonCreateModal";
import LessonEditModal from "../components/lessons/LessonEditModal";
import SessionsModal from "../components/lessons/SessionsModal";

export default function AdminLessonsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // новое — модалка расписания/сессий
  const [isSessionsOpen, setIsSessionsOpen] = useState(false);

  return (
    <div className="p-10 text-white space-y-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Уроки</h1>

        <div className="flex gap-4">
          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-4 py-2 bg-yellow-500 text-black rounded font-semibold hover:bg-yellow-400"
          >
            Создать урок
          </button>

          <button
            onClick={() => setIsSessionsOpen(true)}
            className="px-4 py-2 bg-blue-500 text-black rounded font-semibold hover:bg-blue-400"
          >
            Расписание
          </button>
        </div>
      </div>

      <LessonsList onEdit={(id) => setEditId(id)} />

      {/* создание */}
      <LessonCreateModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />

      {/* редактирование */}
      {editId && <LessonEditModal id={editId} onClose={() => setEditId(null)} />}

      {/* новое — расписание */}
      <SessionsModal isOpen={isSessionsOpen} onClose={() => setIsSessionsOpen(false)} />
    </div>
  );
}
