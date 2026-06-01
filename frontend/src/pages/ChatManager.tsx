import { useEffect, useState, lazy, Suspense } from 'react';
import { Client } from '../services/httpClient';
import { ChatFrontendService } from '../services/chat.service';
import { SectionsFrontendService } from '../services/sections.service';
import { EventsFrontendService } from '../services/events.service';

const ChatCreateModal = lazy(() => import('../components/chat/ChatCreateModal'));
const ChatEditModal = lazy(() => import('../components/chat/ChatEditModal'));
const ChatAddParticipantModal = lazy(() => import('../components/chat/ChatAddParticipantModal'));



const client = Client

const chatService = new ChatFrontendService(client);
const sectionsService = new SectionsFrontendService(client);
const eventsService = new EventsFrontendService(client);

export default function ChatsManager() {
  const [chats, setChats] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [editChat, setEditChat] = useState<any | null>(null);
  const [addUserChat, setAddUserChat] = useState<any | null>(null);

  const loadAll = async () => {
    const chats = await chatService.findAll<any[]>();
    const secs = await sectionsService.findAll<any[]>();
    const evs = await eventsService.findAll<any[]>();

    setChats(chats);
    setSections(secs);
    setEvents(evs);
  };

  const openChatMessages = async (chat: any) => {
    setSelectedChat(chat);
    const msgs = await chatService.getMessages<any[]>(chat.id);
    setMessages(msgs.reverse());
  };

  useEffect(() => {
    loadAll();
  }, []);

  const deleteChat = async (chatId: string) => {
    if (!confirm('Удалить чат?')) return;
    await client.delete(`/chat/${chatId}`);
    await loadAll();
  };

  return (
    <div className="text-customwhite p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Чаты</h1>

        <button
          className="px-4 py-2 bg-[#52C57B] rounded hover:bg-green-500"
          onClick={() => setCreateOpen(true)}
        >
          Создать чат
        </button>
      </div>

      {/* CHAT LIST */}
      <div className="space-y-4">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className="p-4 bg-customgrey border border-customwhite/10 rounded flex justify-between"
          >
            <div>
              <p><b>ID:</b> {chat.id}</p>
              <p><b>Тип:</b> {chat.type}</p>
              {chat.section && <p><b>Секция:</b> {chat.section.name}</p>}
              {chat.event && <p><b>Событие:</b> {chat.event.name}</p>}

              <p className="mt-2"><b>Участники:</b></p>
              {chat.participants.map((p: any) => (
                <div key={p.user.id} className="ml-4 flex items-center gap-2">
                  {p.user.firstName} {p.user.lastName}
                  <button
                    onClick={async () => {
                      await client.delete(`/chat/${chat.id}/participants/${p.user.id}`);
                      await loadAll();
                    }}
                    className="text-[#FF6B4A] hover:text-red-300"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              <button
                className="px-3 py-1 bg-[#3DA9FC] rounded hover:bg-[#5BC0EB]"
                onClick={() => openChatMessages(chat)}
              >
                Открыть
              </button>

              <button
                className="px-3 py-1 bg-customyellow text-customblack rounded hover:bg-customyellow"
                onClick={() => setEditChat(chat)}
              >
                Редактировать
              </button>

              <button
                className="px-3 py-1 bg-purple-600 rounded hover:bg-purple-500"
                onClick={() => setAddUserChat(chat)}
              >
                Добавить участника
              </button>

              <button
                className="px-3 py-1 bg-[#D9534F] rounded hover:bg-red-500"
                onClick={() => deleteChat(chat.id)}
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MESSAGES VIEW */}
      {selectedChat && (
        <div className="mt-8 p-4 bg-[#222] border border-customwhite/10 rounded">
          <h2 className="text-xl font-bold mb-2">
            Сообщения чата {selectedChat.id}
          </h2>

          {messages.map((m) => (
            <div key={m.id} className="mb-2">
              <b>{m.author.firstName} {m.author.lastName}:</b> {m.content}
            </div>
          ))}
        </div>
      )}

<Suspense fallback={null}>
      {/* MODALS */}
      <ChatCreateModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        sections={sections}
        events={events}
        reload={loadAll}
      />

      {editChat && (
        <ChatEditModal
          isOpen={true}
          onClose={() => setEditChat(null)}
          chat={editChat}
          sections={sections}
          events={events}
          reload={loadAll}
        />
      )}

      {addUserChat && (
        <ChatAddParticipantModal
          isOpen={true}
          onClose={() => setAddUserChat(null)}
          chat={addUserChat}
          reload={loadAll}
        />
      )}

</Suspense>

    </div>
  );
}
