import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

// ==== Типы ====
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
  const [subscriptionCount] = useState(5)
  const { isAuthenticated } = useAuth()

  // ==== Заглушки для занятий ====
  const mockSessions: Session[] = [
    {
      id: 1,
      sectionId: 10,
      teacherId: 5,
      startTime: '2025-01-01T10:00:00',
      endTime: '2025-01-01T11:00:00',
      capacity: 10,
      currentEnrollment: 3,
      section: { name: 'Йога' },
      teacher: { name: 'Екатерина' },
      location: 'Зал №1'
    },
    {
      id: 2,
      sectionId: 11,
      teacherId: 7,
      startTime: '2025-01-01T14:00:00',
      endTime: '2025-01-01T15:00:00',
      capacity: 12,
      currentEnrollment: 8,
      section: { name: 'Стретчинг' },
      teacher: { name: 'Анна' },
      location: 'Зал №2'
    },
    {
      id: 3,
      sectionId: 12,
      teacherId: 8,
      startTime: '2025-01-01T18:00:00',
      endTime: '2025-01-01T19:30:00',
      capacity: 15,
      currentEnrollment: 12,
      section: { name: 'Пилатес' },
      teacher: { name: 'Мария' },
      location: 'Зал №1'
    }
  ]

  // ==== Заглушки для событий ====
  const mockEvents: Event[] = [
    {
      id: 1,
      title: 'Мастер-класс по растяжке',
      description: 'Углублённая тренировка для всех уровней подготовки.',
      imageUrl: '/images/event1.jpg',
      startTime: '2025-01-01T18:00:00',
      endTime: '2025-01-01T20:00:00',
      price: 500
    },
    {
      id: 2,
      title: 'Йога на природе',
      description: 'Расслабляющая практика на свежем воздухе.',
      imageUrl: '/images/event2.jpg',
      startTime: '2025-01-01T09:00:00',
      endTime: '2025-01-01T10:30:00'
    }
  ]

  const mockUserEnrollments = [1]

  // ==== Заглушки вместо API ====
  useEffect(() => {
    setSessions(mockSessions)
    setEvents(mockEvents)
    if (isAuthenticated) setEnrolledSessions(mockUserEnrollments)
  }, [selectedDate, isAuthenticated])

  const handleEnroll = (sessionId: number) => {
    if (!isAuthenticated) {
      alert('Пожалуйста, войдите в систему')
      return
    }
    alert('Заглушка: записываем на занятие')
    setEnrolledSessions(prev => [...prev, sessionId])
  }

  // ==== Форматирование ====
  const formatDate = (d: Date) =>
    d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'numeric' })

  const formatTime = (t: string) =>
    new Date(t).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })

  // ==== Генерация дней недели ====
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

  // 🔥 БЕЗ ФИЛЬТРАЦИИ ПО ДАТЕ
  const filteredSessions = sessions

  // ==== JSX ====
  return (
    <div className="relative w-[1920px] min-h-[2180px] bg-[#464042] text-white font-['Unbounded']">
      <h1 className="text-center mt-[176px] text-[96px] font-['Zero_Cool'] text-[#F5C78B]">
        РАСПИСАНИЕ
      </h1>

      {/* Количество бесплатных посещений */}
      <div className="absolute left-[40px] top-[314px] flex items-center gap-[24px]">
        <span className="text-[20px]">Кол-во бесплатных посещений:</span>
        <div className="w-[70px] h-[69px] bg-[#F5C78B] flex justify-center items-center rounded-[5px] border-2 border-[#F4C884]">
          <span className="text-[20px] text-black font-h1">{subscriptionCount}</span>
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
                <span className="text-[24px] font-h1">{date.getDate()}</span>
                <span className="text-[16px] uppercase">{dayName}</span>
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-[16px] ml-[40px]">
          <button onClick={handlePrevWeek} className="text-[24px] text-[#F4C884]">&lt;</button>
          <span className="text-[20px] text-[#F4C884]">
            {formatDate(weekDates[0])} - {formatDate(weekDates[6])}
          </span>
          <button onClick={handleNextWeek} className="text-[24px] text-[#F4C884]">&gt;</button>
        </div>
      </div>

      {/* Список занятий */}
      <div className="absolute left-1/2 transform -translate-x-1/2 top-[457px] flex flex-wrap justify-center gap-[30px] w-[90%]">
        {filteredSessions.map(session => {
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
                    className={`text-[96px] font-['Zero_Cool'] leading-[110px] ${
                      isEnrolled ? 'text-black' : 'text-[#F5C78B]'
                    }`}
                  >
                    {formatTime(session.startTime)}
                  </span>

                  <div className="mt-[24px]">
                    <h3 className="text-[32px] font-h1">{session.section.name}</h3>
                    <p className="text-[16px] mt-[14px] max-w-[300px]">
                      Место: {session.location} <br />
                      Участников: {session.currentEnrollment}/{session.capacity}
                    </p>
                  </div>

                  <div className="mt-[24px] flex items-center gap-[8px]">
                    <div className="w-[32px] h-[32px] rounded-full flex items-center justify-center bg-[#F4C884]">
                      <img src="path_to_person_icon.png" alt="teacher" className="w-[16px] h-[16px]" />
                    </div>
                    <span className="text-[16px]">{session.teacher.name}</span>
                  </div>
                </div>

                <div className="mt-[24px]">
                  {!isEnrolled ? (
                    <button
                      onClick={() => handleEnroll(session.id)}
                      className="w-[213px] h-[73px] bg-[#F4C884] mt-[24px] mx-auto rounded-[5px] border-2 border-[#2D282A] text-[20px] text-black font-h1 hover:bg-[#F4C884]/80 transition"
                    >
                      записаться
                    </button>
                  ) : (
                    <div className="w-[213px] h-[73px] bg-[#F4C884] mt-[24px] mx-auto rounded-[5px] border-2 border-black flex items-center justify-center">
                      <span className="text-[20px] font-h1">записан(а)</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* События */}
      <div className="absolute left-0 right-0 top-[1189px] bg-[#1F1B1C] flex flex-col items-center py-[60px]">
        {events.length > 0 && (
          <>
            <div className="relative w-full flex flex-col items-center">
              {events.map(event =>
                selectedEvent?.id === event.id ? (
                  <div
                    key={event.id}
                    className="w-[90%] max-w-[1800px] transition-all bg-[#2D282A] p-[40px] rounded-[8px]"
                  >
                    <div className="flex gap-[40px] items-center">
                      <img src={event.imageUrl} alt={event.title} className="w-[600px] h-[400px] object-cover rounded-[8px]" />
                      <div className="flex flex-col gap-[16px] max-w-[800px]">
                        <h3 className="text-[64px] font-['Zero_Cool'] text-[#F5C78B]">{event.title}</h3>
                        <p className="text-[20px] text-white">{event.description}</p>
                        <p className="text-[24px] text-[#F4C884] font-h1">
                          {formatTime(event.startTime)}–{formatTime(event.endTime)}
                        </p>
                        <div className="mt-[16px] flex gap-[16px] items-center">
                          <span className="text-[32px] font-h1 text-white">
                            Стоимость: {event.price ? `${event.price}₽` : 'Бесплатно'}
                          </span>
                          <button className="bg-[#F4C884] text-black font-h1 px-[40px] py-[16px] rounded-[5px] border-2 border-[#2D282A] hover:bg-[#F4C884]/80 transition">
                            записаться
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null
              )}

              <div className="flex justify-center gap-[16px] mt-[40px]">
                {events.map((_, index) => {
                  const isActive = selectedEvent ? events.indexOf(selectedEvent) === index : index === 0
                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedEvent(events[index])}
                      className={`w-[50px] h-[50px] rounded-full border-4 border-[#F5C78B] transition-all ${
                        isActive ? 'bg-[#F5C78B] scale-110' : 'bg-transparent hover:bg-[#F5C78B]/30'
                      }`}
                    />
                  )
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
