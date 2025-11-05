import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import { Calendar, Clock, MapPin, Users, CheckCircle } from 'lucide-react'

interface Session {
  id: number
  sectionId: number
  teacherId: number
  startTime: string
  endTime: string
  capacity: number
  currentEnrollment: number
  section: {
    name: string
  }
  teacher: {
    name: string
  }
  location?: string
}

export default function SchedulePage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [enrolledSessions, setEnrolledSessions] = useState<number[]>([])
  const [subscriptionCount, setSubscriptionCount] = useState(0)
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    fetchSessions()
    if (isAuthenticated) {
      fetchUserEnrollments()
    }
  }, [selectedDate, isAuthenticated])

  const fetchSessions = async () => {
    try {
      const dateStr = selectedDate.toISOString().split('T')[0]
      const response = await axios.get(`/api/sessions?date=${dateStr}`)
      setSessions(response.data)
    } catch (error) {
      console.error('Ошибка загрузки расписания:', error)
    }
  }

  const fetchUserEnrollments = async () => {
    try {
      const response = await axios.get('/api/users/me/enrollments')
      setEnrolledSessions(response.data.map((e: any) => e.sessionId))
      setSubscriptionCount(response.data.filter((e: any) => e.status === 'PAID').length)
    } catch (error) {
      console.error('Ошибка загрузки записей:', error)
    }
  }

  const handleEnroll = async (sessionId: number) => {
    if (!isAuthenticated) {
      alert('Пожалуйста, войдите в систему')
      return
    }

    try {
      await axios.post(`/api/sessions/${sessionId}/enroll`)
      alert('Вы успешно записались на занятие!')
      fetchSessions()
      fetchUserEnrollments()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Ошибка при записи')
    }
  }

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + days)
    setSelectedDate(newDate)
  }

  const groupSessionsByTime = () => {
    const grouped: { [key: string]: Session[] } = {}
    sessions.forEach((session) => {
      const timeKey = new Date(session.startTime).toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
      })
      if (!grouped[timeKey]) {
        grouped[timeKey] = []
      }
      grouped[timeKey].push(session)
    })
    return grouped
  }

  const groupedSessions = groupSessionsByTime()

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Заголовок и счётчик */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h1 className="text-4xl font-bold">Расписание</h1>
            
            {isAuthenticated && (
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg">
                <div className="text-sm opacity-90">Оплаченные посещения</div>
                <div className="text-3xl font-bold">{subscriptionCount}</div>
              </div>
            )}
          </div>
        </div>

        {/* Выбор даты */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => changeDate(-1)}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            >
              ← Предыдущий день
            </button>
            
            <div className="text-center">
              <div className="text-sm text-gray-600">Выбранная дата</div>
              <div className="text-2xl font-bold text-orange-600">
                {selectedDate.toLocaleDateString('ru-RU', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>
            
            <button
              onClick={() => changeDate(1)}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            >
              Следующий день →
            </button>
          </div>
        </div>

        {/* Расписание по времени */}
        <div className="space-y-6">
          {Object.keys(groupedSessions).length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <Calendar size={64} className="mx-auto text-gray-400 mb-4" />
              <p className="text-xl text-gray-600">На эту дату занятий нет</p>
            </div>
          ) : (
            Object.entries(groupedSessions)
              .sort(([timeA], [timeB]) => timeA.localeCompare(timeB))
              .map(([time, sessionsAtTime]) => (
                <div key={time} className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-2xl font-bold mb-4 text-orange-600 flex items-center gap-2">
                    <Clock size={24} />
                    {time}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sessionsAtTime.map((session) => {
                      const isEnrolled = enrolledSessions.includes(session.id)
                      const isFull = session.currentEnrollment >= session.capacity
                      
                      return (
                        <div
                          key={session.id}
                          className={`border-2 rounded-lg p-4 ${
                            isEnrolled
                              ? 'border-green-500 bg-green-50'
                              : isFull
                              ? 'border-gray-300 bg-gray-50'
                              : 'border-orange-300 bg-orange-50'
                          }`}
                        >
                          <h4 className="font-bold text-lg mb-2">{session.section.name}</h4>
                          
                          <div className="space-y-2 text-sm text-gray-700 mb-4">
                            <div className="flex items-center gap-2">
                              <Users size={16} />
                              <span>
                                {session.currentEnrollment}/{session.capacity} мест
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Users size={16} />
                              <span>Тренер: {session.teacher.name}</span>
                            </div>
                            
                            {session.location && (
                              <div className="flex items-center gap-2">
                                <MapPin size={16} />
                                <span>{session.location}</span>
                              </div>
                            )}
                          </div>

                          {isEnrolled ? (
                            <div className="flex items-center justify-center gap-2 bg-green-500 text-white py-2 rounded-lg font-semibold">
                              <CheckCircle size={18} />
                              Вы записаны
                            </div>
                          ) : (
                            <button
                              onClick={() => handleEnroll(session.id)}
                              disabled={isFull || !isAuthenticated}
                              className={`w-full py-2 rounded-lg font-semibold transition ${
                                isFull || !isAuthenticated
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700'
                              }`}
                            >
                              {isFull ? 'Нет мест' : !isAuthenticated ? 'Войдите для записи' : 'Записаться'}
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  )
}

