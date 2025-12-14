// AdminSectionsPage.tsx

import  { useState, lazy, Suspense } from 'react';
import SectionsList from '../components/sections/SectionList';
const SectionCreateModal = lazy(() => import('../components/sections/SectionCreateModal'));
const SectionEditModal = lazy(() => import('../components/sections/SectionEditModal'));


export default function AdminSectionsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  return (
    <div className="p-10 text-white space-y-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Секции</h1>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-4 py-2 bg-customyellow text-black rounded font-semibold"
        >
          Создать секцию
        </button>
      </div>

      <SectionsList onEdit={(id) => setEditId(id)} />
<Suspense fallback={null}>

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
</Suspense>

    </div>
  );
}
