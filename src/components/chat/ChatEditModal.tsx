// src/components/chat/ChatEditModal.tsx
import React, { useEffect, useState } from 'react';
import { HttpClient } from '../../services/httpClient';
import { SectionsFrontendService } from '../../services/sections.service';
import { EventsFrontendService } from '../../services/events.service';
import { ChatFrontendService } from '../../services/chat.service';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  chat: {
    id: string;
    type: 'SUPPORT' | 'SECTION' | 'EVENT';
    section?: { id: string; name: string } | null;
    event?: { id: string; name: string } | null;
  } | null;
  sections?: { id: string; name: string }[];
  events?: { id: string; name: string }[];
  reload?: () => Promise<void> | void;
}

const client = new HttpClient({
  baseUrl:
    (import.meta.env.VITE_ADMIN_API_URL as string | undefined) ??
    (import.meta.env.VITE_API_URL as string | undefined) ??
    'http://localhost:3000/api',
  getToken: () => localStorage.getItem('token') ?? undefined,
});

const chatService = new ChatFrontendService(client);
const sectionsService = new SectionsFrontendService(client);
const eventsService = new EventsFrontendService(client);

export default function ChatEditModal({ isOpen, onClose, chat, sections = [], events = [], reload }: Props) {
  const [type, setType] = useState<'SUPPORT' | 'SECTION' | 'EVENT'>('SUPPORT');
  const [sectionId, setSectionId] = useState<string>('');
  const [eventId, setEventId] = useState<string>('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (chat) {
      setType(chat.type);
      setSectionId(chat.section?.id ?? '');
      setEventId(chat.event?.id ?? '');
    }
  }, [chat, isOpen]);

  // In case sections/events not passed, try to fetch minimal lists (optional)
  useEffect(() => {
    async function fetchRefs() {
      try {
        if (!sections || sections.length === 0) {
          const secs = await sectionsService.findAll<any[]>();
          // if service returns wrapper, try unwrap
          // @ts-ignore
          if (Array.isArray(secs)) {
            // nothing, since props override; this is a best-effort
          }
        }
        if (!events || events.length === 0) {
          const evs = await eventsService.findAll<any[]>();
          // best-effort
        }
      } catch {
        // ignore
      }
    }
    fetchRefs();
  }, []); // run once

  if (!isOpen || !chat) return null;

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await chatService.updateChat(chat.id, {
        type,
        sectionId: type === 'SECTION' ? (sectionId || undefined) : undefined,
        eventId: type === 'EVENT' ? (eventId || undefined) : undefined,
      });
      if (reload) await reload();
      onClose();
    } catch (err: any) {
      console.error('Ошибка сохранения чата', err);
      alert(err?.message ?? 'Ошибка');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#111] p-5 rounded-xl w-full max-w-md text-white border border-white/10">
        <h3 className="text-lg font-semibold mb-3">Редактировать чат</h3>

        <form onSubmit={save} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-300">Тип чата</label>
            <select
              value={type ?? 'SUPPORT'}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full bg-[#222] px-3 py-2 rounded border border-white/10"
            >
              <option value="SUPPORT">SUPPORT</option>
              <option value="SECTION">SECTION</option>
              <option value="EVENT">EVENT</option>
            </select>
          </div>

          {type === 'SECTION' && (
            <div>
              <label className="block mb-1 text-gray-300">Секция</label>
              <select
                value={sectionId ?? ''}
                onChange={(e) => setSectionId(e.target.value)}
                className="w-full bg-[#222] px-3 py-2 rounded border border-white/10"
              >
                <option value="">Выберите секцию</option>
                {sections.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {type === 'EVENT' && (
            <div>
              <label className="block mb-1 text-gray-300">Событие</label>
              <select
                value={eventId ?? ''}
                onChange={(e) => setEventId(e.target.value)}
                className="w-full bg-[#222] px-3 py-2 rounded border border-white/10"
              >
                <option value="">Выберите событие</option>
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 rounded">
              Отмена
            </button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-yellow-500 text-black rounded">
              {saving ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
