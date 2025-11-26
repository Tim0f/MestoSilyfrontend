// AdminSectionsPage.tsx

import React, { useState } from 'react';
import SectionsList from '../components/sections/SectionList';
import SectionCreateModal from '../components/sections/SectionCreateModal';
import SectionEditModal from '../components/sections/SectionEditModal';

export default function AdminSectionsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  return (
    <div className="p-10 text-white space-y-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Секции</h1>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-4 py-2 bg-yellow-500 text-black rounded font-semibold"
        >
          Создать секцию
        </button>
      </div>

      <SectionsList onEdit={(id) => setEditId(id)} />

      {/* Модалка создания */}
      <SectionCreateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      {/* Модалка редактирования */}
      {editId && (
        <SectionEditModal
          id={editId}
          isOpen={true}
          onClose={() => setEditId(null)}
        />
      )}
    </div>
  );
}
