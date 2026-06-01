import React, { useState } from 'react';
import { Client } from '../../services/httpClient';

const client = Client

export default function ChatCreateModal({
  isOpen,
  onClose,
  sections,
  events,
  reload,
}: any) {
  const [type, setType] = useState<'SUPPORT' | 'SECTION' | 'EVENT'>('SUPPORT');
  const [sectionId, setSectionId] = useState('');
  const [eventId, setEventId] = useState('');

  if (!isOpen) return null;

  const create = async (e: React.FormEvent) => {
    e.preventDefault();

    await client.post('/chat', {
      type,
      sectionId: type === 'SECTION' ? sectionId : undefined,
      eventId: type === 'EVENT' ? eventId : undefined,
    });

    onClose();
    reload();
  };

  return (
    <div className="fixed inset-0 bg-customblack/70 flex items-center justify-center z-50">
      <div className="bg-customgrey p-6 rounded-xl border border-customwhite/10 w-full max-w-lg text-customwhite">
        <h2 className="text-xl font-bold mb-4">Создать чат</h2>

        <form onSubmit={create} className="space-y-4">

          {/* TYPE */}
          <div>
            <label className="block mb-1">Тип чата</label>
            <select
              className="w-full bg-customblack px-3 py-2 rounded border border-customwhite/10"
              value={type}
              onChange={(e) => setType(e.target.value as any)}
            >
              <option value="SUPPORT">SUPPORT</option>
              <option value="SECTION">SECTION</option>
              <option value="EVENT">EVENT</option>
            </select>
          </div>

          {/* SECTION */}
          {type === 'SECTION' && (
            <div>
              <label className="block mb-1">Секция</label>
              <select
                value={sectionId}
                onChange={(e) => setSectionId(e.target.value)}
                className="w-full bg-customblack px-3 py-2 rounded border border-customwhite/10"
              >
                <option value="">Выберите секцию</option>
                {sections.map((s: any) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* EVENT */}
          {type === 'EVENT' && (
            <div>
              <label className="block mb-1">Событие</label>
              <select
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
                className="w-full bg-customblack px-3 py-2 rounded border border-customwhite/10"
              >
                <option value="">Выберите событие</option>
                {events.map((ev: any) => (
                  <option key={ev.id} value={ev.id}>{ev.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-customgrey rounded"
            >
              Отмена
            </button>
            <button type="submit" className="px-4 py-2 bg-[#52C57B] rounded">
              Создать
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
