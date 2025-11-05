import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import { Send, MessageSquare } from 'lucide-react'

interface Message {
  id: number
  content: string
  userId: number
  chatType: string
  createdAt: string
  user: {
    name: string
  }
}

type ChatType = 'MARKETPLACE' | 'SECTIONS' | 'SUPPORT'

export default function ChatsPage() {
  const [selectedChat, setSelectedChat] = useState<ChatType>('MARKETPLACE')
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      fetchMessages()
      const interval = setInterval(fetchMessages, 3000) // Обновление каждые 3 секунды
      return () => clearInterval(interval)
    }
  }, [selectedChat, isAuthenticated])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`/api/chat/${selectedChat}`)
      setMessages(response.data)
    } catch (error) {
      console.error('Ошибка загрузки сообщений:', error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    try {
      await axios.post('/api/chat', {
        content: newMessage,
        chatType: selectedChat,
      })
      setNewMessage('')
      fetchMessages()
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <MessageSquare size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Чаты доступны только для авторизованных пользователей</h2>
          <p className="text-gray-600">Пожалуйста, войдите в систему</p>
        </div>
      </div>
    )
  }

  const chatTabs = [
    { type: 'MARKETPLACE' as ChatType, name: 'Ярмарка', icon: '🛒' },
    { type: 'SECTIONS' as ChatType, name: 'Направления', icon: '🏀' },
    { type: 'SUPPORT' as ChatType, name: 'Поддержка', icon: '💬' },
  ]

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Чаты</h1>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden" style={{ height: 'calc(100vh - 250px)' }}>
          {/* Табы чатов */}
          <div className="bg-gray-100 border-b border-gray-200 flex">
            {chatTabs.map((tab) => (
              <button
                key={tab.type}
                onClick={() => setSelectedChat(tab.type)}
                className={`flex-1 py-4 px-6 font-semibold transition ${
                  selectedChat === tab.type
                    ? 'bg-white text-orange-600 border-b-2 border-orange-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>

          {/* Область сообщений */}
          <div className="flex flex-col" style={{ height: 'calc(100% - 65px)' }}>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => {
                const isOwn = message.userId === user?.id
                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-4 ${
                        isOwn
                          ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      {!isOwn && (
                        <div className="font-semibold text-sm mb-1">
                          {message.user.name}
                        </div>
                      )}
                      <p className="whitespace-pre-wrap break-words">{message.content}</p>
                      <div
                        className={`text-xs mt-1 ${
                          isOwn ? 'text-orange-100' : 'text-gray-500'
                        }`}
                      >
                        {new Date(message.createdAt).toLocaleTimeString('ru-RU', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Форма отправки сообщения */}
            <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Введите сообщение..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition flex items-center gap-2"
                >
                  <Send size={20} />
                  Отправить
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

