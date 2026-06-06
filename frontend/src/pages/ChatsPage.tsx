import { getPublicUrl } from "../utils/publicUrl";
import { getAvatarUrl } from "../utils/avatars";
import React, { useEffect, useRef, useState } from "react";
import { Send, MoreVertical, ArrowLeft } from "lucide-react";
import axios from "axios";

import texturedBorder from "../assets/svg/texturedBorder.svg";

import {
  ChatSocketService,
  type ChatMessage as SocketChatMessage,
} from "../services/chatSocket.service";

/* ================= TYPES ================= */

type ChatItem = {
  id: string;
  type: string;
  section?: { name: string; iconUrl?: string } | null;
  event?: { name: string; imageUrl?: string } | null;
  _count?: { messages: number } | null;
};

type ChatMessage = SocketChatMessage;

/* ================= COMPONENT ================= */

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
  const [participantsAvatarMap, setParticipantsAvatarMap] = useState<Record<string, number | string>>({});
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});
  const [newMessage, setNewMessage] = useState("");
  const [autoScroll, setAutoScroll] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [loadingConnection, setLoadingConnection] = useState(true);
  const [firstUnreadId, setFirstUnreadId] = useState<string | null>(null);

  const [showChatList, setShowChatList] = useState(true);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const firstUnreadRef = useRef<HTMLDivElement | null>(null);

  /* ================= UI HELPERS ================= */

  const Avatar = ({
    src,
    avatarId,
    size = 44,
  }: {
    src?: string;
    avatarId?: number | string;
    size?: number;
  }) => {
    const finalAvatarId = avatarId ?? 1;
    const imgSrc = src || getAvatarUrl(finalAvatarId);

    return (
      <div
        className="flex items-center justify-center rounded-full bg-customyellow/50 overflow-hidden"
        style={{ width: size, height: size }}
      >
        {imgSrc ? (
          <img
            src={imgSrc}
            className="max-w-full max-h-full object-contain"
            alt="avatar"
          />
        ) : (
          <span className="text-customwhite font-bold">?</span>
        )}
      </div>
    );
  };

  const getChatName = (c?: ChatItem) =>
    c?.section?.name ?? c?.event?.name ?? "Без названия";

  const getChatAvatar = (c?: ChatItem) => {
    const raw = c?.section?.iconUrl ?? c?.event?.imageUrl ?? undefined;
    return raw ? getPublicUrl(raw) : undefined;
  };

  /* ================= SCROLL ================= */

  const scrollToBottomSmooth = () => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  const handleScroll = () => {
    const c = containerRef.current;
    if (!c) return;

    const atBottom = c.scrollTop + c.clientHeight >= c.scrollHeight - 80;
    setAutoScroll(atBottom);

    if (firstUnreadId && firstUnreadRef.current) {
      const elRect = firstUnreadRef.current.getBoundingClientRect();
      const containerRect = c.getBoundingClientRect();
      if (elRect.bottom <= containerRect.bottom) {
        setFirstUnreadId(null);
      }
    }
  };

  /* ================= DATA ================= */

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

      console.log("Participants raw data:", res.data.participants);

      const map: Record<string, string> = {};
      const avatarMap: Record<string, number | string> = {};

      (res.data.participants ?? []).forEach((p: any) => {
        if (p.user) {
          // Приводим ID к строке для надёжности
          const uid = String(p.user.id);
          map[uid] = `${p.user.firstName ?? ""} ${p.user.lastName ?? ""}`.trim();

          // Ищем аватарку в любом возможном поле
          const avId =
            p.user.avatarID ??
            p.user.avatarId ??
            p.user.avatarid ??
            p.user.avatar ??
            p.user.profile?.avatarID ??
            p.user.avatarUrl;
          if (avId !== undefined && avId !== null) {
            avatarMap[uid] = avId;
          }
        }
      });

      console.log("Built avatarMap:", avatarMap);

      setParticipantsMap(map);
      setParticipantsAvatarMap(avatarMap);
    } catch (e) {
      console.warn("loadParticipants error:", e);
    }
  };

  /* ================= SOCKET ================= */

  useEffect(() => {
    if (!token) return;

    socketRef.current = new ChatSocketService(socketBase, token);
    socketRef.current.connect();

    socketRef.current.onConnect(() => setLoadingConnection(false));

    socketRef.current.onNewMessage((msg) => {
      if (String(msg.chatId) !== String(selectedChatIdRef.current)) return;

      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;

        if (!autoScroll && !firstUnreadId) {
          setFirstUnreadId(msg.id);
        }

        return [...prev, msg];
      });
    });

    socketRef.current.onUserTyping(({ userId, isTyping }) => {
      setTypingUsers((p) => ({ ...p, [userId]: isTyping }));
      if (isTyping) {
        setTimeout(
          () => setTypingUsers((p) => ({ ...p, [userId]: false })),
          3500
        );
      }
    });

    socketRef.current.onDisconnect(() => setLoadingConnection(true));

    return () => socketRef.current?.disconnect();
  }, [token]);

  useEffect(() => {
    selectedChatIdRef.current = selectedChatId;
  }, [selectedChatId]);

  useEffect(() => {
    if (!selectedChatId) return;

    loadParticipants(selectedChatId);
    setLoadingMessages(true);
    setFirstUnreadId(null);

    const join = async () => {
      try {
        const ack = await socketRef.current!.joinChat(selectedChatId);

        if (ack?.messages) {
          setMessages(
            [...ack.messages].sort(
              (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
            )
          );
          setLoadingMessages(false);
          return;
        }
      } catch {}

      try {
        const res = await axios.get(
          `${apiBase}/chat/${selectedChatId}/messages`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setMessages(
          [...res.data].sort(
            (a, b) =>
              new Date(a.createdAt).getTime() -
              new Date(b.createdAt).getTime()
          )
        );
      } catch (e) {
        console.error("REST fallback failed:", e);
      }

      setLoadingMessages(false);
      setTimeout(scrollToBottomSmooth, 50);
    };

    join();
  }, [selectedChatId]);

  /* ================= SEND ================= */

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!selectedChatId) return;

    const text = newMessage.trim();
    if (!text) return;

    setNewMessage("");

    try {
      const ack = await socketRef.current?.sendMessage(selectedChatId, text);
      const msg = ack?.message;

      if (!msg) return;

      setMessages((prev) =>
        prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]
      );
    } catch (e) {
      console.error("sendMessage error:", e);
    }
  };

  const onTypingChange = (v: string) => {
    setNewMessage(v);
    if (selectedChatId) {
      socketRef.current?.sendTyping(selectedChatId, v.length > 0);
    }
  };

  /* ================= INIT ================= */

  useEffect(() => {
    loadChats();
    const t = setInterval(loadChats, 20000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (firstUnreadRef.current) {
      firstUnreadRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [firstUnreadId]);

  useEffect(() => {
    if (autoScroll) scrollToBottomSmooth();
  }, [messages]);

  const typingText = (() => {
    const activeUsers = Object.entries(typingUsers)
      .filter(([, isTyping]) => isTyping)
      .map(([userId]) => participantsMap[userId] ?? "Пользователь");

    if (activeUsers.length === 0) return null;
    if (activeUsers.length === 1) return `${activeUsers[0]} печатает…`;
    if (activeUsers.length === 2)
      return `${activeUsers[0]} и ${activeUsers[1]} печатают…`;

    return `${activeUsers[0]} и ещё ${
      activeUsers.length - 1
    } печатают…`;
  })();

  return (
    <div className="min-h-screen bg-customblack text-customwhite flex items-top justify-center pt-4 md:pt-16">
      <div className="relative w-full">
        <div
          className="pointer-events-none absolute inset-0 z-50"
          style={{ ["--tw-url" as any]: `url(${texturedBorder})` }}
        />

        <div className="bg-transparent rounded-xl overflow-hidden shadow-lg h-screen md:h-[78vh]">
          <div className="flex h-full">
            {/* LEFT PANEL — список чатов */}
            <div
              className={`${
                showChatList ? "flex" : "hidden"
              } md:flex w-full md:w-1/3 bg-customgrey flex-col`}
            >
              <div className="px-4 md:px-6 py-4 md:py-6">
                <h2 className="text-2xl md:text-4xl font-bold">ЧАТЫ</h2>
              </div>
              <div className="border-t border-b border-customyellow/20 mx-4" />

              <div className="overflow-y-auto px-4 py-4 space-y-3 flex-1">
                {chats.length === 0 ? (
                  <div className="text-customwhite/50 text-center">Чатов нет</div>
                ) : (
                  chats.map((c: ChatItem) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedChatId(String(c.id));
                        setShowChatList(false);
                      }}
                      className={`w-full flex items-center gap-4 p-4 rounded-md text-left ${
                        selectedChatId === c.id ? "bg-customgrey" : "bg-transparent"
                      }`}
                    >
                      <Avatar src={getChatAvatar(c)} size={44} />
                      <div className="flex-1">
                        <div className="font-bold text-base md:text-lg">{getChatName(c)}</div>
                        <div className="text-sm text-customwhite/70 mt-1">
                          Сообщений: {c._count?.messages ?? 0}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* RIGHT PANEL — переписка */}
            <div
              className={`${
                !showChatList ? "flex" : "hidden"
              } md:flex flex-1 flex-col bg-customblack`}
            >
              <div className="px-4 md:px-6 py-3 md:py-4 flex items-center justify-between border-b border-customyellow/20">
                <div className="flex items-center gap-3 md:gap-4">
                  <button
                    onClick={() => setShowChatList(true)}
                    className="md:hidden p-1 -ml-2"
                  >
                    <ArrowLeft size={24} />
                  </button>
                  <Avatar
                    size={44}
                    src={getChatAvatar(chats.find((c) => c.id === selectedChatId) ?? undefined)}
                  />
                  <div className="text-lg md:text-2xl font-bold">
                    {getChatName(chats.find((c) => c.id === selectedChatId) ?? undefined)}
                  </div>
                </div>
                <MoreVertical size={20} />
              </div>

              <div
                ref={containerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto px-4 md:px-8 py-4 md:py-8"
              >
                {loadingConnection ? (
                  <div className="text-center text-customwhite/60 mt-10">Подключение к чату…</div>
                ) : loadingMessages ? (
                  <div className="text-center text-customwhite/60 mt-10">Загрузка сообщений…</div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-customwhite/60 mt-10">Нет сообщений</div>
                ) : (
                  <div className="space-y-4 md:space-y-6">
                    {messages.map((m) => {
                      const isMine = m.author?.id === userId;
                      const isFirstUnread = m.id === firstUnreadId;

                      // Поиск аватарки: сначала в авторе сообщения, затем в мапе
                      const authorIdStr = m.author?.id ? String(m.author.id) : null;
                      const avatarId =
                        m.author?.avatarID ??
                        (authorIdStr ? participantsAvatarMap[authorIdStr] : undefined) ??
                        1;

                      // Отладочный вывод
                      if (!isMine) {
                        console.log(
                          `Msg ${m.id}: authorId=${authorIdStr}, authorAvatarID=${m.author?.avatarID}, mapAvatar=${authorIdStr ? participantsAvatarMap[authorIdStr] : 'N/A'}, final=${avatarId}`
                        );
                      }

                      return (
                        <div
                          key={m.id}
                          ref={isFirstUnread ? firstUnreadRef : null}
                          className={`flex items-end gap-2 md:gap-4 ${isMine ? "justify-end" : "justify-start"}`}
                        >
                          {!isMine && (
                            <div className="flex flex-col items-center">
                              <Avatar size={36} avatarId={avatarId} />
                              <div className="text-xs text-customyellow mt-1">
                                {m.author?.firstName ?? "Пользователь"}
                              </div>
                            </div>
                          )}

                          <div className={`max-w-[85%] md:max-w-[70%] ${isMine ? "text-right" : "text-left"}`}>
                            <div
                              className={`p-3 md:p-4 max-w-full md:max-w-[640px] rounded-2xl break-words ${
                                isMine
                                  ? "bg-customyellow text-customblack ml-auto"
                                  : "bg-customyellow/70 text-customwhite"
                              }`}
                            >
                              {m.content}

                              <div className="text-right text-xs text-customwhite/60 mt-2">
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
                  <div className="text-customwhite/60 italic mt-4">{typingText}</div>
                )}

                <div ref={endRef} />
              </div>

              <div className="px-4 md:px-8 py-4 md:py-6 border-t border-customyellow/20">
                <form onSubmit={sendMessage} className="flex items-center gap-3 md:gap-4">
                  <input
                    value={newMessage}
                    onChange={(e) => onTypingChange(e.target.value)}
                    placeholder="Напишите сообщение..."
                    className="flex-1 bg-customgrey text-customwhite rounded-full px-4 md:px-6 py-3 md:py-4 outline-none placeholder-customwhite/40 text-sm md:text-base"
                  />
                  <button type="submit" className="p-3 rounded-full bg-customyellow">
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