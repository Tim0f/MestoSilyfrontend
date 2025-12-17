// src/pages/ChatsPage.tsx
import React, { useEffect, useRef, useState } from "react";
import { Send, MoreVertical } from "lucide-react";
import texturedBorder from "../assets/svg/texturedBorder.svg";
import axios from "axios";
import {
  ChatSocketService,
  type ChatMessage as SocketChatMessage,
} from "../services/chatSocket.service";

type ChatItem = {
  id: string;
  type: string;
  section?: { name: string; imageUrl?: string } | null;
  event?: { name: string; imageUrl?: string } | null;
  _count?: { messages: number } | null;
};

type ChatMessage = SocketChatMessage;

export default function ChatsPage(): JSX.Element {
  const token = localStorage.getItem("token") || "";

  let userId: string | null = null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    userId = payload.sub || payload.userId || null;
  } catch {}

  const apiBase =
    (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ||
    "http://localhost:3000/api";

  const socketBase = apiBase.replace(/\/api$/, "");

  const socketRef = useRef<ChatSocketService | null>(null);
  const selectedChatIdRef = useRef<string | null>(null);

  const [chats, setChats] = useState<ChatItem[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [participantsMap, setParticipantsMap] = useState<Record<string, string>>({});
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});
  const [newMessage, setNewMessage] = useState("");
  const [autoScroll, setAutoScroll] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [loadingConnection, setLoadingConnection] = useState(true);
  const [firstUnreadId, setFirstUnreadId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const firstUnreadRef = useRef<HTMLDivElement | null>(null);

  const Avatar = ({ src, size = 44 }: { src?: string; size?: number }) => (
    <div
      className="flex items-center justify-center rounded-full"
      style={{ width: size, height: size, background: "#E0B26F" }}
    >
      {src ? (
        <img src={src} className="w-full h-full object-cover rounded-full" />
      ) : (
        <span className="text-white font-bold">?</span>
      )}
    </div>
  );

  const getChatName = (c?: ChatItem) =>
    c?.section?.name ?? c?.event?.name ?? "Без названия";

  const getChatAvatar = (c?: ChatItem) =>
    c?.section?.imageUrl ?? c?.event?.imageUrl ?? undefined;

  function scrollToBottomSmooth() {
    if (!endRef.current) return;
    endRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
  }

  const handleScroll = () => {
    const c = containerRef.current;
    if (!c) return;

    const atBottom = c.scrollTop + c.clientHeight >= c.scrollHeight - 80;
    setAutoScroll(atBottom);

    if (firstUnreadId && firstUnreadRef.current) {
      const el = firstUnreadRef.current;
      const elRect = el.getBoundingClientRect();
      const containerRect = c.getBoundingClientRect();
      if (elRect.bottom <= containerRect.bottom) {
        setFirstUnreadId(null);
      }
    }
  };

  const loadChats = async () => {
    try {
      const res = await axios.get(`${apiBase}/chat/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const list = Array.isArray(res.data) ? res.data : [];
      setChats(list);
      setSelectedChatId((prev) => prev ?? list[0]?.id ?? null);
    } catch (e) {
      console.error("loadChats error:", e);
    }
  };

  const loadParticipants = async (chatId: string) => {
    try {
      const res = await axios.get(`${apiBase}/chat/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const map: Record<string, string> = {};
      (res.data.participants ?? []).forEach((p: any) => {
        if (p.user)
          map[p.user.id] = `${p.user.firstName ?? ""} ${p.user.lastName ?? ""}`.trim();
      });
      setParticipantsMap(map);
    } catch (e) {
      console.warn("loadParticipants error:", e);
    }
  };

  useEffect(() => {
    selectedChatIdRef.current = selectedChatId;
  }, [selectedChatId]);

  useEffect(() => {
    if (!token) return;
    socketRef.current = new ChatSocketService(socketBase, token);
    socketRef.current.connect();

    if (typeof socketRef.current.onConnect === "function") {
      socketRef.current.onConnect(() => setLoadingConnection(false));
    } else {
      setTimeout(() => setLoadingConnection(false), 500);
    }

    socketRef.current.onNewMessage((msg) => {
      if (String(msg.chatId) === String(selectedChatIdRef.current)) {
        setMessages((prev) => {
          const alreadyHas = prev.some((m) => m.id === msg.id);
          if (alreadyHas) return prev;

          const upd = [...prev, msg];

          if (!autoScroll && !firstUnreadId) {
            setFirstUnreadId(msg.id);
          }

          return upd;
        });

        
      }
    });

    socketRef.current.onUserTyping(({ userId, isTyping }) => {
      if (!userId) return;
      setTypingUsers((prev) => ({ ...prev, [userId]: isTyping }));
      if (isTyping)
        setTimeout(() => {
          setTypingUsers((prev) => ({ ...prev, [userId]: false }));
        }, 3500);
    });

    socketRef.current.onDisconnect?.(() => {
      setLoadingConnection(true);
    });

    return () => socketRef.current?.disconnect();
  }, [token]);

  useEffect(() => {
    if (!selectedChatId) return;
    loadParticipants(selectedChatId);
    setLoadingMessages(true);
    setFirstUnreadId(null);

    const join = async () => {
      try {
        const ack = await socketRef.current!.joinChat(selectedChatId);
        if (ack?.messages) {
          const sorted = [...ack.messages].sort(
            (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
          setMessages(sorted);
          setLoadingMessages(false);
          return;
        }
      } catch {}

      try {
        const res = await axios.get(`${apiBase}/chat/${selectedChatId}/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const sorted = [...res.data].sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        setMessages(sorted);
      } catch (e) {
        console.error("REST messages fallback failed:", e);
      }

      setLoadingMessages(false);
      setTimeout(() => scrollToBottomSmooth(), 50);
    };

    join();
  }, [selectedChatId]);

const sendMessage = async (e?: React.FormEvent) => {
  e?.preventDefault();
  if (!selectedChatId) return;

  const text = newMessage.trim();
  if (!text) return;

  setNewMessage("");

  try {
    const ack = await socketRef.current?.sendMessage(selectedChatId, text);

    const msg = ack?.message;
    if (!msg) return; // ← защита от undefined

    setMessages((prev) => {
      if (prev.some((m) => m.id === msg.id)) return prev;
      return [...prev, msg]; // ← строго ChatMessage
    });

  } catch {}
};


  const onTypingChange = (v: string) => {
    setNewMessage(v);
    if (selectedChatId) socketRef.current?.sendTyping(selectedChatId, v.length > 0);
  };

  useEffect(() => {
    loadChats();
    const t = setInterval(loadChats, 20000);
    return () => clearInterval(t);
  }, []);

  //
  // FIXED SCROLL TO FIRST UNREAD
  //
  useEffect(() => {
    if (!firstUnreadId || !firstUnreadRef.current) return;

    firstUnreadRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end", // гарантирует полную видимость
    });
  }, [firstUnreadId]);

  useEffect(() => {
    if (!autoScroll) return;

    requestAnimationFrame(() => {
      scrollToBottomSmooth();
    });
  }, [messages]);

  const typingText = (() => {
    const active = Object.entries(typingUsers)
      .filter(([, v]) => v)
      .map(([id]) => participantsMap[id] ?? "Пользователь");

    if (active.length === 0) return null;
    if (active.length === 1) return `${active[0]} печатает…`;
    if (active.length === 2) return `${active[0]} и ${active[1]} печатают…`;
    return `${active[0]} и ещё ${active.length - 1} печатают…`;
  })();

  return (
    <div className="min-h-screen bg-customblack text-white flex items-top justify-center ">
      <div className="relative w-full ">
        <div
          className="pointer-events-none absolute inset-0 z-50"
          style={{ ["--tw-url" as any]: `url(${texturedBorder})` }}
        />

        <div className="bg-transparent rounded-xl overflow-hidden shadow-lg" style={{ height: "78vh" }}>
          <div className="flex h-full">
            {/* LEFT */}
            <div className="w-1/3 bg-[#3A3333] flex flex-col">
              <div className="px-6 py-6">
                <h2 className="text-4xl font-bold">ЧАТЫ</h2>
              </div>
              <div className="border-t border-b border-[#E0B26F]/20 mx-4" />

              <div className="overflow-y-auto px-4 py-4 space-y-3 flex-1">
                {chats.length === 0 ? (
                  <div className="text-white/50 text-center">Чатов нет</div>
                ) : (
                  chats.map((c: ChatItem) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedChatId(String(c.id))}
                      className={`w-full flex items-center gap-4 p-4 rounded-md text-left ${
                        selectedChatId === c.id ? "bg-[#352e2e]" : "bg-transparent"
                      }`}
                    >
                      <Avatar src={getChatAvatar(c)} size={56} />
                      <div className="flex-1">
                        <div className="font-bold text-lg">{getChatName(c)}</div>
                        <div className="text-sm text-white/70 mt-1">
                          Сообщений: {c._count?.messages ?? 0}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex-1 flex flex-col bg-[#2f2929]">
              <div className="px-6 py-4 flex items-center justify-between border-b border-[#E0B26F]/20">
                <div className="flex items-center gap-4">
                  <Avatar
                    size={56}
                    src={getChatAvatar(chats.find((c) => c.id === selectedChatId) ?? undefined)}
                  />
                  <div className="text-2xl font-bold">
                    {getChatName(chats.find((c) => c.id === selectedChatId) ?? undefined)}
                  </div>
                </div>
                <MoreVertical size={20} />
              </div>

              <div
                ref={containerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto px-8 py-8"
              >
                {loadingConnection ? (
                  <div className="text-center text-white/60 mt-10">Подключение к чату…</div>
                ) : loadingMessages ? (
                  <div className="text-center text-white/60 mt-10">Загрузка сообщений…</div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-white/60 mt-10">Нет сообщений</div>
                ) : (
                  <div className="space-y-6">
                    {messages.map((m) => {
                      const isMine = m.author?.id === userId;
                      const isFirstUnread = m.id === firstUnreadId;

                      return (
                        <div
                          key={m.id}
                          ref={isFirstUnread ? firstUnreadRef : null}
                          className={`flex  items-end gap-4 ${isMine ? "justify-end" : "justify-start"}`}
                        >
                          {!isMine && <Avatar size={44} />}

                          <div className={`max-w-[70%] ${isMine ? "text-right" : "text-left"}`}>
                            {!isMine && (
                              <div className="text-xs text-[#E0B26F] mb-1">
                                {m.author?.firstName ?? "Пользователь"}
                              </div>
                            )}

                            <div
                              className={`p-4 w-auro max-w-[640px] rounded-2xl break-words ${
                                isMine
                                  ? "bg-[#E0B26F] text-customblack ml-auto"
                                  : "bg-[#F7C985] text-[#3A3333]"
                              }`}
                            >
                              {m.content}

                              <div className="text-right text-xs text-white/60 mt-2">
                                {new Date(m.createdAt).toLocaleTimeString("ru-RU", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {typingText && (
                  <div className="text-white/60 italic mt-4">{typingText}</div>
                )}

                <div ref={endRef} />
              </div>

              <div className="px-8 py-6 border-t border-[#E0B26F]/20">
                <form onSubmit={sendMessage} className="flex items-center gap-4">
                  <input
                    value={newMessage}
                    onChange={(e) => onTypingChange(e.target.value)}
                    placeholder="Напишите сообщение..."
                    className="flex-1 bg-[#3a3434] text-white rounded-full px-6 py-4 outline-none placeholder-white/40"
                  />
                  <button type="submit" className="p-3 rounded-full bg-[#E0B26F]">
                    <Send size={20} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
