import React, { useEffect, useState } from 'react';
import { Client } from '../../services/httpClient';
import { TeachersFrontendService } from '../../services/teachers.service';

import TeacherCreateModal from './TeacherscreateModal';
import TeacherEditModal from './TeachersEditModal';

interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  phone?: string;
  role?: string;
  photoUrl?: string;
  audioUrl?: string;
}

const client = Client

const teachersService = new TeachersFrontendService(client);

export default function TeachersManager() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  const [createOpen, setCreateOpen] = useState(false);
  const [editTeacher, setEditTeacher] = useState<Teacher | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const list = await teachersService.findAll<Teacher[]>();
      setTeachers(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const deleteTeacher = async (id: string) => {
    if (!confirm('Удалить преподавателя?')) return;
    await teachersService.remove(id);
    await loadData();
  };

  const formatFio = (t: Teacher) =>
    `${t.lastName} ${t.firstName}${t.middleName ? ' ' + t.middleName : ''}`;

  return (
    <div className="text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Преподаватели</h1>

        <button
          onClick={() => setCreateOpen(true)}
          className="px-4 py-2 bg-customyellow text-black rounded hover:bg-customyellow"
        >
          Создать преподавателя
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400">Загрузка...</p>
      ) : (
        <div className="space-y-4">
          {teachers.map((t) => (
            <div
              key={t.id}
              className="p-4 bg-customgrey border border-white/10 rounded-xl flex justify-between items-center"
            >
              <div className="flex gap-4 items-center">
                <img
                  src={t.photoUrl || 'https://via.placeholder.com/80'}
                  alt="photo"
                  className="w-20 h-20 rounded object-cover border border-white/10"
                />

                <div>
                  <h2 className="text-xl font-semibold">{formatFio(t)}</h2>
                  <p className="text-customwhite">Роль: {t.role || '—'}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  className="px-3 py-1 bg-[#5BC0EB] rounded hover:bg-blue-400"
                  onClick={() => setEditTeacher(t)}
                >
                  Изменить
                </button>

                <button
                  className="px-3 py-1 bg-red-500 rounded hover:bg-[#FF6B4A]"
                  onClick={() => deleteTeacher(t.id)}
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <TeacherCreateModal
        isOpen={createOpen}
        onClose={() => {
          setCreateOpen(false);
          loadData();
        }}
      />

      {editTeacher && (
        <TeacherEditModal
          isOpen={true}
          teacher={editTeacher}
          onClose={() => {
            setEditTeacher(null);
            loadData();
          }}
        />
      )}
    </div>
  );
}
