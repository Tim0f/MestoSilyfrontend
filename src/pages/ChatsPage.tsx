// src/pages/ChatsPage.tsx
import React, { useEffect, useRef, useState } from "react";
import { Send, MoreVertical } from "lucide-react";
import texturedBorder from "../assets/svg/texturedBorder.svg";
import axios from "axios";
import {
  ChatSocketService,
  ChatMessage,
  ChatAck
} from "../services/chatSocket.service";

type ChatItem = {
  id: string;
  type: string;
  section?: { name: string; imageUrl?: string };
  event?: { name: string; imageUrl?: string };
  _count?: { messages: number };
};

export default function ChatsPage() {
  const token = localStorage.getItem("token") || "";

  const baseUrl =
    (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ||
    "http://localhost:3000/api";

  const socket = useRef<ChatSocketService | null>(null);

  const [chats, setChats] = useState<ChatItem[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  /** ----- LOAD CHATS (REST) ----- */
  const loadChats = async () => {
    try {
      const res = await axios.get(`${baseUrl}/chat`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const list: ChatItem[] = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
        ? res.data.data
        : [];

      setChats(list);

      if (!selectedChatId && list.length > 0) {
        setSelectedChatId(list[0].id);
      }
    } catch (e) {
      console.error("loadChats error:", e);
    }
  };

  /** ----- LOAD MESSAGES (REST fallback) ----- */
  const loadMessages = async (chatId: string) => {
    try {
      const res = await axios.get(`${baseUrl}/chat/${chatId}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessages(res.data || []);
    } catch (e) {
      console.error("loadMessages error:", e);
    }
  };

  /** ----- INIT SOCKET ONCE ----- */
  useEffect(() => {
    if (!token) return;

    const socketBase = baseUrl.replace(/\/api$/, ""); // правильный ws URL
    socket.current = new ChatSocketService(socketBase, token);
    socket.current.connect();

    socket.current.onConnect(() => console.log("WS connected"));
    socket.current.onDisconnect(() => console.log("WS disconnected"));

    socket.current.onNewMessage(msg => {
      if (msg.chatId === selectedChatId) {
        setMessages(prev => [...prev, msg]);
        scrollToBottom();
      }
    });

    return () => socket.current?.disconnect();
  }, [token]);

  /** ----- JOIN CHAT WHEN SELECTED ----- */
  useEffect(() => {
    if (!selectedChatId || !socket.current) return;

    const join = async () => {
      const ack: ChatAck = await socket.current!.joinChat(selectedChatId);

      if (ack.error) {
        console.warn("joinChat error:", ack.error);
        await loadMessages(selectedChatId);
        return;
      }

      if (ack.success) {
        setMessages(ack.messages ?? []);
        scrollToBottom();
        return;
      }

      await loadMessages(selectedChatId);
    };

    join();
  }, [selectedChatId]);

  /** ----- AUTO SCROLL ----- */
  const scrollToBottom = () => {
    setTimeout(
      () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
      30
    );
  };

  /** ----- SEND MESSAGE ----- */
  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!selectedChatId) return;

    const text = newMessage.trim();
    if (!text) return;

    setNewMessage("");

    if (socket.current) {
      const ack = await socket.current.sendMessage(selectedChatId, text);

if (ack.error) {
  console.warn("sendMessage error:", ack.error);
  await loadMessages(selectedChatId);
  return;
}

if (ack.message !== undefined) {
  const msg: ChatMessage = ack.message;
  setMessages(prev => [...prev, msg]);
  scrollToBottom();
  return;
}

    }

    // fallback
    await loadMessages(selectedChatId);
  };

  /** ----- AUTO REFRESH CHATS ----- */
  useEffect(() => {
    loadChats();
    const interval = setInterval(loadChats, 20000);
    return () => clearInterval(interval);
  }, []);

  /** ----- AVATAR COMPONENT ----- */
  const Avatar = ({
    src,
    size = 44
  }: {
    src?: string;
    size?: number;
  }) => (
    <div
      className="flex items-center justify-center rounded-full bg-[#E0B26F]"
      style={{ width: size, height: size }}
    >
      {src ? (
        <img
          src={src}
          className="w-full h-full object-cover rounded-full"
          alt=""
        />
      ) : (
        <span className="text-white font-bold">?</span>
      )}
    </div>
  );

  const getChatName = (c?: ChatItem) =>
    c?.section?.name || c?.event?.name || "Без названия";

  const getChatAvatar = (c?: ChatItem) =>
    c?.section?.imageUrl || c?.event?.imageUrl || undefined;

  return (
    <div className="min-h-screen bg-[#2D282A] text-white flex items-center justify-center py-10 px-4">
      <div className="relative w-full max-w-[1400px]">
        <div
          className="pointer-events-none absolute inset-0 z-50
            before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-4 before:bg-[var(--tw-url)] before:bg-repeat-x before:bg-top
            after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-4 after:bg-[var(--tw-url)] after:bg-repeat-x after:bg-bottom"
          style={{ ["--tw-url" as any]: `url(${texturedBorder})` }}
        />

        <div
          className="bg-transparent rounded-xl overflow-hidden shadow-lg"
          style={{ height: "78vh" }}
        >
          <div className="flex h-full">
            {/* LEFT PANEL */}
            <div className="w-1/3 bg-[#3A3333] flex flex-col">
              <div className="px-6 py-6">
                <h2 className="text-4xl font-bold">ЧАТЫ</h2>
              </div>

              <div className="border-t border-b border-[#E0B26F]/20 mx-4" />

              <div className="overflow-y-auto px-4 py-4 space-y-3 flex-1">
                {chats.length === 0 ? (
                  <div className="text-white/50 text-center">Чатов нет</div>
                ) : (
                  chats.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedChatId(c.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-md ${
                        selectedChatId === c.id
                          ? "bg-[#352e2e]"
                          : "bg-transparent"
                      }`}
                    >
                      <Avatar src={getChatAvatar(c)} size={56} />
                      <div className="flex-1">
                        <div className="font-bold text-lg">
                          {getChatName(c)}
                        </div>
                        <div className="text-sm text-white/70">
                          Сообщений: {c._count?.messages ?? 0}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="flex-1 flex flex-col bg-[#2f2929]">
              <div className="px-6 py-4 flex items-center justify-between border-b border-[#E0B26F]/20">
                <div className="flex items-center gap-4">
                  <Avatar
                    size={56}
                    src={getChatAvatar(
                      chats.find(c => c.id === selectedChatId)
                    )}
                  />
                  <div className="text-2xl font-bold">
                    {getChatName(chats.find(c => c.id === selectedChatId))}
                  </div>
                </div>
                <MoreVertical size={20} />
              </div>

              <div className="flex-1 overflow-y-auto px-8 py-8">
                {messages.length === 0 ? (
                  <div className="text-center text-white/60 mt-10">
                    Нет сообщений
                  </div>
                ) : (
                  <div className="space-y-6">
                    {messages.map(m => (
                      <div key={m.id} className="flex justify-start items-end">
                        <Avatar size={44} />
                        <div className="ml-4 max-w-[60%]">
                          <div className="text-xs text-[#E0B26F] mb-1">
                            {m.author?.firstName ?? "Пользователь"}
                          </div>
                          <div className="p-4 rounded-2xl bg-[#F7C985] text-[#3A3333] break-words">
                            {m.content}
                            <div className="text-right text-xs text-white/60 mt-2">
                              {new Date(m.createdAt).toLocaleTimeString(
                                "ru-RU",
                                { hour: "2-digit", minute: "2-digit" }
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              <div className="px-8 py-6 border-t border-[#E0B26F]/20">
                <form onSubmit={sendMessage} className="flex items-center gap-4">
                  <input
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Напишите сообщение..."
                    className="flex-1 bg-[#3a3434] text-white rounded-full px-6 py-4 outline-none placeholder-white/40"
                  />
                  <button
                    type="submit"
                    className="p-3 rounded-full bg-[#E0B26F]"
                  >
                    <Send size={20} />
                  </button>
                </form>
              </div>
            </div>
            {/* END RIGHT PANEL */}
          </div>
        </div>
      </div>
    </div>
  );
}
