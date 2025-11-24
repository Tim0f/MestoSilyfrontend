import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { Send, MoreVertical, X } from 'lucide-react'
import texturedBorder from '../assets/svg/texturedBorder.svg'

type ChatListItem = {
  id: number | string
  name: string
  lastMessage?: string
  avatar?: string
  unread?: number
}

type Message = {
  id: number | string
  chatId: number | string
  content: string
  userId?: number | null
  userName?: string
  createdAt: string
}

function useGuestName() {
  const key = 'guest_name_v1'
  const [name, setName] = useState<string | null>(() => {
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (!name) {
      const generated = `Гость#${Math.floor(1000 + Math.random() * 9000)}`
      try {
        localStorage.setItem(key, generated)
      } catch {}
      setName(generated)
    }
  }, [name])

  return { name }
}

export default function ChatsPage() {
  const [chats, setChats] = useState<ChatListItem[]>([])
  const [selectedChatId, setSelectedChatId] = useState<number | string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const [loadingChats, setLoadingChats] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(false)

  const { name: guestName } = useGuestName()

  const fetchChats = async () => {
    setLoadingChats(true)
    try {
      const res = await axios.get('/api/chats')
      setChats(res.data)
      if (!selectedChatId && res.data?.length > 0) {
        setSelectedChatId(res.data[0].id)
      }
    } catch (e) {
      console.error('fetchChats error', e)
    } finally {
      setLoadingChats(false)
    }
  }

  const fetchMessages = async (chatId?: number | string | null) => {
    if (!chatId) return
    setLoadingMessages(true)
    try {
      const res = await axios.get(`/api/chat/${chatId}/messages`)
      setMessages(res.data)
    } catch (e) {
      console.error('fetchMessages error', e)
    } finally {
      setLoadingMessages(false)
    }
  }

  useEffect(() => {
    fetchChats()
    const i = setInterval(fetchChats, 30000)
    return () => clearInterval(i)
  }, [])

  useEffect(() => {
    if (selectedChatId) {
      fetchMessages(selectedChatId)
      const i = setInterval(() => fetchMessages(selectedChatId), 3000)
      return () => clearInterval(i)
    }
  }, [selectedChatId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const text = newMessage.trim()
    if (!text || !selectedChatId) return

    try {
      await axios.post('/api/chat', {
        chatId: selectedChatId,
        content: text,
        userName: guestName,
      })
      setNewMessage('')
      fetchMessages(selectedChatId)
    } catch (e) {
      console.error('send error', e)
    }
  }

  const Avatar: React.FC<{ src?: string; size?: number }> = ({ src, size = 44 }) => (
    <div
      className="flex items-center justify-center rounded-full flex-shrink-0"
      style={{ width: size, height: size, background: '#E0B26F' }}
    >
      {src ? (
        <img src={src} alt="avatar" className="w-full h-full object-cover rounded-full" />
      ) : (
        <div className="text-xs font-h2 text-white">{guestName ? guestName.charAt(0) : 'Г'}</div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-[#2D282A] text-white flex items-center justify-center py-10 px-4">

      {/* ОБОЛОЧКА С РВАНОЙ РАМКОЙ */}
      <div className="relative w-full max-w-[1400px]">

        {/* РАМКА ПО ВСЕМ СТОРОНАМ */}
        <div
          className="
            pointer-events-none
            absolute inset-0 z-50

            before:content-['']
            before:absolute before:top-0 before:left-0
            before:w-full before:h-4
            before:bg-[var(--tw-url)]
            before:bg-repeat-x before:bg-top

            after:content-['']
            after:absolute after:bottom-0 after:left-0
            after:w-full after:h-4
            after:bg-[var(--tw-url)]
            after:bg-repeat-x after:bg-bottom
          "
          style={{ ['--tw-url' as any]: `url(${texturedBorder})` }}
        />

        {/* ДОБАВЛЯЕМ ЛЕВУЮ И ПРАВУЮ БОКОВУЮ РАМКУ */}
        <div
          className="
            pointer-events-none
            absolute inset-0 z-50

            before:content-['']
            before:absolute before:top-0 before:left-0
            before:h-full before:w-4
            before:bg-[var(--tw-url)]
            before:bg-repeat-y before:bg-left

            after:content-['']
            after:absolute after:top-0 after:right-0
            after:h-full after:w-4
            after:bg-[var(--tw-url)]
            after:bg-repeat-y after:bg-right
          "
          style={{ ['--tw-url' as any]: `url(${texturedBorder})` }}
        />

        {/* ВНУТРЕННИЙ ИНТЕРФЕЙС ЧАТА */}
        <div className="bg-transparent rounded-xl overflow-hidden shadow-lg" style={{ height: '78vh' }}>
          <div className="flex h-full">

            {/* ЛЕВАЯ ПАНЕЛЬ */}
            <div className="w-1/3 bg-[#3A3333] flex flex-col">

              <div className="px-6 py-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button className="p-2 rounded-md hover:bg-white/5">
                    <X size={20} />
                  </button>
                  <h2 className="text-4xl font-h1 tracking-wide">ЧАТЫ</h2>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-sm font-h2 text-[#E0B26F]">40</div>
                  <Avatar size={36} />
                </div>
              </div>

              <div className="border-t border-b border-[#E0B26F]/20 mx-4" />

              <div className="overflow-y-auto px-4 py-4 space-y-4 flex-1">
                {loadingChats ? (
                  <div className="text-sm text-gray-300">Загрузка чатов...</div>
                ) : (
                  chats.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedChatId(c.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-md transition-all text-left ${
                        selectedChatId === c.id ? 'bg-[#352e2e]' : 'bg-transparent'
                      }`}
                    >
                      <div className="w-16 flex items-center justify-between">
                        <Avatar src={c.avatar} size={64} />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-h1 text-lg">{c.name}</div>
                            <div className="text-sm text-white/70 mt-1">{c.lastMessage || '—'}</div>
                          </div>
                          {c.unread ? (
                            <div className="ml-4 w-8 h-8 rounded-full bg-[#E0B26F] flex items-center justify-center text-sm font-h2 text-[#3A3333]">
                              {c.unread > 99 ? '99+' : c.unread}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>

              <div className="px-6 py-4 border-t border-[#E0B26F]/20 text-sm text-white/70">
                Версия интерфейса
              </div>
            </div>

            {/* ПРАВАЯ ПАНЕЛЬ */}
            <div className="flex-1 flex flex-col bg-[#2f2929] relative">

              {/* ХЕДЕР */}
              <div className="px-6 py-4 flex items-center justify-between border-b border-[#E0B26F]/20">
                <div className="flex items-center gap-4">
                  <Avatar
                    size={56}
                    src={chats.find((c) => c.id === selectedChatId)?.avatar}
                  />
                  <div>
                    <div className="font-h2 text-2xl">
                      {chats.find((c) => c.id === selectedChatId)?.name || 'Выберите чат'}
                    </div>
                    <div className="text-sm text-white/70">последнее сообщение</div>
                  </div>
                </div>
                <button className="p-2 rounded-md hover:bg-white/5">
                  <MoreVertical size={20} />
                </button>
              </div>

              {/* СООБЩЕНИЯ */}
              <div className="flex-1 overflow-y-auto px-8 py-8">
                {loadingMessages ? (
                  <div className="text-sm text-gray-300">Загрузка сообщений...</div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-white/60 mt-12">Нет сообщений</div>
                ) : (
                  <div className="space-y-6">
                    {messages.map((m) => {
                      const isOwn = m.userName === guestName
                      return (
                        <div
                          key={m.id}
                          className={`flex items-end ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          {!isOwn && <Avatar size={44} />}

                          <div className={`max-w-[60%] ${isOwn ? 'ml-4' : 'mr-4'}`}>
                            {!isOwn && (
                              <div className="text-xs font-h2 text-[#E0B26F] mb-2">
                                {m.userName || 'Администратор'}
                              </div>
                            )}

                            <div
                              className={`p-4 rounded-2xl break-words leading-relaxed ${
                                isOwn
                                  ? 'bg-gradient-to-r from-[#E0B26F] to-[#D8A85A] text-[#3A3333]'
                                  : 'bg-[#F7C985] text-[#3A3333]'
                              }`}
                            >
                              <div className="text-sm">{m.content}</div>
                              <div className="text-xs mt-2 text-white/60 text-right">
                                {new Date(m.createdAt).toLocaleTimeString('ru-RU', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </div>
                            </div>
                          </div>

                          {isOwn && <Avatar size={44} />}
                        </div>
                      )
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* ПОЛЕ ВВОДА */}
              <div className="px-8 py-6 border-t border-[#E0B26F]/20 bg-[#2f2929]">
                <form onSubmit={handleSend} className="flex items-center gap-4">
                  <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Напишите сообщение..."
                    className="flex-1 bg-[#3a3434] placeholder-white/40 text-white rounded-full px-6 py-4 outline-none border border-transparent focus:border-[#E0B26F]/40"
                  />
                  <button
                    type="submit"
                    className="rounded-full p-3 bg-[#E0B26F] hover:brightness-90 flex items-center justify-center"
                    aria-label="Отправить"
                  >
                    <Send size={20} />
                  </button>
                </form>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
