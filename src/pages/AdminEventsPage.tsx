// AdminEventsPage.tsx
// Страница управления событиями (Events)

import  { useState } from 'react';
import EventsList from '../components/events/EventsList';
import EventCreateModal from '../components/events/EventCreateModal';
import EventEditModal from '../components/events/EventEditModal';

export default function AdminEventsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  return (
    <div className="p-10 text-white space-y-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">События</h1>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-4 py-2 bg-customyellow text-black rounded font-semibold hover:bg-customyellow"
        >
          Создать событие
        </button>
      </div>

      <EventsList onEdit={(id) => setEditId(id)} />

      <EventCreateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      {editId && (
        <EventEditModal
          id={editId}
          onClose={() => setEditId(null)}
        />
      )}
    </div>
  );
}
