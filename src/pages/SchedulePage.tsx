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
  section: { name: string }
  teacher: { name: string }
  location?: string
}

interface Event {
  id: number
  title: string
  description: string
  imageUrl: string
  startTime: string
  endTime: string
  price?: number
}

export default function SchedulePage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [enrolledSessions, setEnrolledSessions] = useState<number[]>([])
  const [subscriptionCount, setSubscriptionCount] = useState(5)
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    fetchSessions()
    fetchEvents()
    if (isAuthenticated) fetchUserEnrollments()
  }, [selectedDate, isAuthenticated])

  const fetchSessions = async () => {
    try {
      const dateStr = selectedDate.toISOString().split('T')[0]
      const res = await axios.get(`/api/sessions?date=${dateStr}`)
      setSessions(res.data)
    } catch (err) {
      console.error('Ошибка загрузки расписания:', err)
    }
  }

  const fetchEvents = async () => {
    try {
      const res = await axios.get('/api/events')
      setEvents(res.data)
    } catch (err) {
      console.error('Ошибка загрузки событий:', err)
    }
  }

  const fetchUserEnrollments = async () => {
    try {
      const res = await axios.get('/api/users/me/enrollments')
      setEnrolledSessions(res.data.map((e: any) => e.sessionId))
    } catch (err) {
      console.error('Ошибка загрузки записей:', err)
    }
  }

  const handleEnroll = async (sessionId: number) => {
    if (!isAuthenticated) {
      alert('Пожалуйста, войдите в систему')
      return
    }
    try {
      await axios.post(`/api/sessions/${sessionId}/enroll`)
      alert('Вы успешно записались!')
      fetchSessions()
      fetchUserEnrollments()
    } catch (err: any) {
      alert(err.response?.data?.message || 'Ошибка при записи')
    }
  }

  // генерация недельных дат
  const getWeekDates = () => {
    const dates = []
    const current = new Date(selectedDate)
    const day = current.getDay()
    const diffToMonday = day === 0 ? -6 : 1 - day
    current.setDate(current.getDate() + diffToMonday)
    for (let i = 0; i < 7; i++) {
      const d = new Date(current)
      d.setDate(current.getDate() + i)
      dates.push(d)
    }
    return dates
  }

  const weekDates = getWeekDates()
  const formatDate = (d: Date) =>
    d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'numeric' })
  const formatTime = (t: string) =>
    new Date(t).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })

  const handlePrevWeek = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(selectedDate.getDate() - 7)
    setSelectedDate(newDate)
  }

  const handleNextWeek = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(selectedDate.getDate() + 7)
    setSelectedDate(newDate)
  }

  const handleSelectDate = (d: Date) => setSelectedDate(d)
  const weekRange = `${formatDate(weekDates[0])} - ${formatDate(weekDates[6])}`

  const filteredSessions = sessions.filter(
    s => new Date(s.startTime).toDateString() === selectedDate.toDateString()
  )

  const toggleEvent = (event: Event) => {
    if (selectedEvent?.id === event.id) {
      setSelectedEvent(null)
    } else {
      setSelectedEvent(event)
    }
  }

  return (
    <div className="relative w-[1920px] min-h-[2180px] bg-[#2D282A] text-white font-['Unbounded']">
      {/* Заголовок */}
      <h1 className="text-center mt-[176px] text-[96px] font-bold text-[#F5C78B] font-['Zero_Cool'] tracking-[8px]">
        РАСПИСАНИЕ
      </h1>


      {/* Кол-во бесплатных посещений */}
      <div className="absolute left-[40px] top-[314px] flex items-center gap-[24px]">
        <span className="text-[20px]">Кол-во бесплатных посещений:</span>
        <div className="w-[70px] h-[69px] bg-[#F5C78B] flex justify-center items-center rounded-[5px] border-2 border-[#F4C884]">
          <span className="text-[20px] text-black font-bold">{subscriptionCount}</span>
        </div>
      </div>

      {/* Навигация по неделе */}
      <div className="absolute left-1/2 transform -translate-x-1/2 top-[320px] flex items-center gap-[24px]">
        <div className="flex gap-[8px]">
          {weekDates.map((date, i) => {
            const isActive = date.toDateString() === selectedDate.toDateString()
            const dayName = date.toLocaleDateString('ru-RU', { weekday: 'short' })
            return (
              <button
                key={i}
                onClick={() => handleSelectDate(date)}
                className={`w-[98px] h-[85px] flex flex-col justify-center items-center rounded-[5px] border-2 border-[#F4C884] transition-all ${
                  isActive ? 'bg-[#F5C78B] text-black' : 'text-white hover:bg-[#F4C884]/20'
                }`}
              >
                <span className="text-[24px] font-bold">
                  {date.getDate()}
                </span>
                <span className="text-[16px] uppercase">{dayName}</span>
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-[16px] ml-[40px]">
          <button onClick={handlePrevWeek} className="text-[24px] text-[#F4C884]">&lt;</button>
          <span className="text-[20px] text-[#F4C884]">{weekRange}</span>
          <button onClick={handleNextWeek} className="text-[24px] text-[#F4C884]">&gt;</button>
        </div>
      </div>

      {/* Список занятий */}
      <div className="absolute left-1/2 transform -translate-x-1/2 top-[457px] flex flex-wrap justify-center gap-[30px] w-[90%]">
        {filteredSessions.length === 0 ? (
          <p className="text-[#F4C884] text-[24px] mt-[80px]">На этот день нет занятий</p>
        ) : (
          filteredSessions.map(session => {
            const isEnrolled = enrolledSessions.includes(session.id)
            return (
              <div
                key={session.id}
                className={`w-[597px] h-[604px] rounded-[5px] border-2 border-[#F4C884] p-[40px] relative ${
                  isEnrolled ? 'bg-[#F5C78B] text-black' : 'bg-[#2D282A] text-white'
                }`}
              >
                <div
                  className={`absolute left-[40px] top-[40px] bottom-[40px] w-[2px] ${
                    isEnrolled ? 'bg-black' : 'bg-[#F5C78B]'
                  }`}
                ></div>
                <div className="ml-[140px] flex flex-col justify-between h-full py-[20px]">
                  <div>
                    <span
                      className={`text-[96px] font-bold font-['Zero_Cool'] leading-[110px] ${
                        isEnrolled ? 'text-black' : 'text-[#F5C78B]'
                      }`}
                    >
                      {formatTime(session.startTime)}
                    </span>
                    <div className="mt-[24px]">
                      <h3 className="text-[32px] font-bold">{session.section.name}</h3>
                      <p className="text-[16px] mt-[14px] max-w-[300px]">
                        Место: {session.location || 'зал №1'} <br />
                        Участников: {session.currentEnrollment}/{session.capacity}
                      </p>
                    </div>
                    <div className="mt-[24px] flex items-center gap-[8px]">
                      <div
                        className={`w-[32px] h-[32px] rounded-full flex items-center justify-center ${
                          isEnrolled ? 'bg-black' : 'bg-[#F4C884]'
                        }`}
                      >
                        <img src="path_to_person_icon.png" alt="teacher" className="w-[16px] h-[16px]" />

                      </div>
                      <span className="text-[16px]">{session.teacher.name}</span>
                    </div>
                  </div>
                  <div className="mt-[24px]">
                    {!isEnrolled ? (
                      <button
                        onClick={() => handleEnroll(session.id)}
                        className="relative w-[213px] h-[73px] bg-[#F4C884] mt-[24px] mx-auto rounded-[5px] border-2 border-[#2D282A] text-[20px] text-black font-bold hover:bg-[#F4C884]/80 transition"
                      >
                        записаться
                      </button>
                    ) : (
                      <div className="relative w-[213px] h-[73px] bg-[#F4C884] mt-[24px] mx-auto rounded-[5px] border-2 border-black flex items-center justify-center">
                        <span className="text-[20px] font-bold">записан(а)</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* 🔥 Блок событий (новый) */}
      <div className="absolute left-0 right-0 top-[1189px] bg-[#1F1B1C] flex flex-col items-center py-[60px]">
        {events.map(event => (
          <div
            key={event.id}
            onClick={() => toggleEvent(event)}
            className={`w-[90%] max-w-[1800px] cursor-pointer transition-all ${
              selectedEvent?.id === event.id ? 'bg-[#2D282A] p-[40px] rounded-[8px]' : 'bg-[#2D282A]'
            }`}
          >
            {/* Свернутый вид */}
            {selectedEvent?.id !== event.id && (
              <div className="h-[285px] bg-cover bg-center flex items-center justify-between px-[80px]" style={{ backgroundImage: `url(${event.imageUrl})` }}>
                <h3 className="text-[96px] font-bold text-[#F5C78B] font-['Zero_Cool']">
                  {new Date(event.startTime).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })}{' '}
                  {formatTime(event.startTime)}–{formatTime(event.endTime)}
                </h3>
                <span className="text-[32px] text-[#F4C884]">{event.title}</span>
              </div>
            )}

            {/* Развёрнутый вид */}
            {selectedEvent?.id === event.id && (
              <div className="flex gap-[40px] items-center">
                <img src={event.imageUrl} alt={event.title} className="w-[600px] h-[400px] object-cover rounded-[8px]" />
                <div className="flex flex-col gap-[16px] max-w-[800px]">
                  <h3 className="text-[64px] font-['Zero_Cool'] text-[#F5C78B]">{event.title}</h3>
                  <p className="text-[20px] text-white">{event.description}</p>
                  <p className="text-[24px] text-[#F4C884] font-bold">
                    {new Date(event.startTime).toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', weekday: 'long' })} {' '}
                    {formatTime(event.startTime)}–{formatTime(event.endTime)}
                  </p>
                  <div className="mt-[16px] flex gap-[16px] items-center">
                    <span className="text-[32px] font-bold text-white">
                      Стоимость: {event.price ? `${event.price}₽` : 'Бесплатно'}
                    </span>
                    <button className="bg-[#F4C884] text-black font-bold px-[40px] py-[16px] rounded-[5px] border-2 border-[#2D282A] hover:bg-[#F4C884]/80 transition">
                      записаться
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
