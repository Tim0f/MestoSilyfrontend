import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

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
  const [subscriptionCount, setSubscriptionCount] = useState(5) // Статическое значение как в макете
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

  // Генерация дат для недели
  const getWeekDates = () => {
    const dates = []
    const current = new Date(selectedDate)
    // Находим понедельник текущей недели
    const dayOfWeek = current.getDay()
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
    current.setDate(current.getDate() + diffToMonday)
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(current)
      date.setDate(current.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  const weekDates = getWeekDates()

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Заголовок и счетчик */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center mb-4">РАСПИСАНИЕ</h1>
          <div className="text-center text-lg">
            Кол-во бесплатных посещений: {subscriptionCount}
          </div>
        </div>

        {/* Календарь недели */}
        <div className="grid grid-cols-7 gap-2 mb-8">
          {weekDates.map((date, index) => (
            <div
              key={index}
              className={`text-center p-2 rounded cursor-pointer ${
                isToday(date) ? 'bg-orange-100' : ''
              }`}
              onClick={() => setSelectedDate(date)}
            >
              <div className="font-semibold">{date.getDate()}</div>
              <div className="text-sm text-gray-600">
                {date.toLocaleDateString('ru-RU', { weekday: 'short' })}
              </div>
            </div>
          ))}
        </div>

        {/* Список занятий */}
        <div className="space-y-6 mb-8">
          {sessions
            .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
            .map((session) => {
              const isEnrolled = enrolledSessions.includes(session.id)
              const isFull = session.currentEnrollment >= session.capacity
              
              return (
                <div key={session.id} className="border-b border-gray-200 pb-6">
                  <div className="flex items-start gap-6">
                    <div className="text-2xl font-bold text-orange-600 min-w-20">
                      {formatTime(session.startTime)}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{session.section.name}</h3>
                      <p className="text-gray-600 mb-4">
                        Откройте для себя искусство владения клинком. От базовых стоек до изящных атак.
                      </p>
                      
                      <div className="text-gray-700 mb-4">
                        <div>{session.teacher.name}</div>
                      </div>

                      <div className="flex gap-4">
                        <button
                          onClick={() => handleEnroll(session.id)}
                          disabled={isFull || !isAuthenticated || isEnrolled}
                          className={`px-6 py-2 rounded-lg font-semibold ${
                            isEnrolled
                              ? 'bg-gray-300 text-gray-600 cursor-default'
                              : isFull || !isAuthenticated
                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {isEnrolled ? 'записаны' : isFull ? 'Нет мест' : !isAuthenticated ? 'Войдите для записи' : 'записаться'}
                        </button>
                        
                        <div className="text-lg font-bold">
                          1000 руб/час
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
        </div>

        {/* Анонс */}
        <div className="bg-gray-100 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold mb-2">Фиона в Месте силы!</h3>
          <p className="text-gray-700">01.02 18:00–21:00</p>
        </div>

        {/* Контакты */}
        <div className="bg-gray-100 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Где мы находимся:</h3>
          <p className="text-gray-700 mb-2">г.Москва каширское шоссе, а1</p>
          <p className="text-gray-700 mb-2">meatpain@gmail.com</p>
          <p className="text-gray-700">+7 926 898 77 98</p>
        </div>
      </div>
    </div>
  )
}