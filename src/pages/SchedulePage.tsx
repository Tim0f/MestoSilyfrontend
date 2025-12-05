import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Parkur from '../assets/svg/parkur.svg'
import Border from '../assets/svg/texturedBorder.svg?react'
import Border2 from '../components/border2'
import Border3 from '../assets/svg/numb.svg?react'
import Event1 from '../assets/img/Mask_group.png'
import Event2 from '../assets/img/Mask_group2.png'
import btnFrame from "../assets/svg/Rectangle_9.svg";


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
  iconUrl: string

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
      location: 'Зал №1',
      iconUrl: Parkur,
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
      location: 'Зал №2',
      iconUrl: Parkur,
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
      location: 'Зал №1',
      iconUrl: Parkur,
    }
  ]

  // ==== Заглушки для событий ====
  const mockEvents: Event[] = [
    {
      id: 1,
      title: 'Мастер-класс по растяжке',
      description: 'Углублённая тренировка для всех уровней подготовки.',
      imageUrl: Event1,
      startTime: '2025-01-01T18:00:00',
      endTime: '2025-01-01T20:00:00',
      price: 500,

    },
    {
      id: 2,
      title: 'Йога на природе',
      description: 'Расслабляющая практика на свежем воздухе.',
      imageUrl: Event2,
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
    <div className="w-full min-h-screen bg-[#2D282A] text-white font-['Unbounded'] flex flex-col items-center pb-[200px]">

      {/* ===== Заголовок ===== */}
      <h1 className="mt-[120px] text-[96px] font-h1 text-[#F5C78B] text-center">
        РАСПИСАНИЕ
      </h1>
      <div className="flex items-center gap-[40px]">

{/* ===== Количество бесплатных посещений ===== */}
<div className="flex items-center gap-[20px]">
  <span className="text-[24px] text-white">Кол-во бесплатных посещений:</span>

  {/* Рваный квадрат числа */}
  <div className="
    w-[95px] h-[85px] flex justify-center items-center fill-customyellow
  "
  style={{
    backgroundImage: `url(${Border3})`,
    backgroundSize: '95px 85px',
    backgroundColor:'customyellow',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  }}
  >
    <span className="text-[28px] text-black font-h1 leading-none">
      {subscriptionCount}
    </span>
  </div>
</div>


{/* ===== Навигация по неделе ===== */}
<div className="flex items-center gap-[28px]">

  {/* Дни недели */}
  <div className="flex gap-[18px]">

    {weekDates.map((date, i) => {
      const isActive = date.toDateString() === selectedDate.toDateString()
      const dayName = date.toLocaleDateString('ru-RU', { weekday: 'short' })

      return (
        <button
          key={i}
          onClick={() => handleSelectDate(date)}
          className={`
            w-[95px] h-[85px] flex flex-col justify-center items-center relative
            transition-all

          `
        }
        >
          <Border2 className={`
    ${isActive ? "fill-customblack" : "fill-customyellow"}
    stroke-customyellow
  `}>
{/* Число */}
          <span className="text-[26px] font-h1 text-black leading-none">
            {date.getDate()}
          </span>

          {/* День недели */}
          <span className="text-[15px] mt-[3px] uppercase">{dayName}</span>
          </Border2>
          

          
        </button>
      )
    })}

  </div>


  {/* Навигация стрелками */}
  <div className="flex items-center gap-[16px] text-[#F4C884]">
    <button onClick={handlePrevWeek} className="text-[30px]">&lt;</button>

    <span className="text-[20px]">
      {formatDate(weekDates[0])} - {formatDate(weekDates[6])}
    </span>

    <button onClick={handleNextWeek} className="text-[30px]">&gt;</button>
  </div>

</div>

</div>
{/* ===== Карточки занятий ===== */}
      <div aria-hidden className="mt-[60px] w-full h-full max-w-[1600px] flex justify-center gap-[40px]">
        {filteredSessions.map(session => {
          const isEnrolled = enrolledSessions.includes(session.id)

          return (
            <div
  key={session.id}
  className={`w-[520px] h-[560px]  p-[40px] relative 
    ${isEnrolled ? 'bg-[#F5C78B] text-black' : 'bg-[#2D282A] text-white'}`}
    style={{
      backgroundImage: `url(${Border})`,
      backgroundSize: "100% 100%",
      backgroundRepeat: "no-repeat",

    }}
>
  <div className="flex w-full h-full">

    {/* 50% — SVG иконка */}
    <div className="w-1/2 flex items-center justify-center">
      <div
        aria-hidden
        className="w-[220px] h-[480px] select-none pointer-events-none"
        style={{
          WebkitMaskImage: `url(${session.iconUrl})`,
    maskImage: `url(${session.iconUrl})`,

    WebkitMaskSize: "contain",
    maskSize: "contain",

    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",

    WebkitMaskPosition: "center",
    maskPosition: "center",
          backgroundColor: isEnrolled ? '#2D282A' : '#F5C78B',
        }}
      />
    </div>

    {/* 50% — текст */}
    <div className="w-1/2 flex flex-col ">

      {/* Время / Название / Описание */}
      <div>
        <span
          className={`text-[72px] font-['Zero_Cool'] leading-[80px] ${
            isEnrolled ? 'text-black' : 'text-[#F5C78B]'
          }`}
        >
          {formatTime(session.startTime)}
        </span>

        <h3 className="text-[28px] font-h1 text-customyellow drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]">
          {session.section.name}
        </h3>

        <p className="text-[16px] mt-[10px] max-w-[300px] text-customwhite font-p">
          Место: {session.location} <br />
          Участников: {session.currentEnrollment}/{session.capacity}
        </p>
      </div>

      {/* Учитель */}
      <div className="mt-[20px] flex items-center gap-[12px]">
        <div>
          <div className="text-customyellow font-p">Учитель:</div>
          <div className="text-customwhite font-p">{session.teacher.name}</div>
        </div>
      </div>

      {/* Кнопка */}
      <div className=" pt-[20px]">
        {!isEnrolled ? (
          <button
            onClick={() => handleEnroll(session.id)}
            className="w-[213px] h-[73px] bg-[#F4C884] mx-auto rounded-[5px] border-2 border-[#2D282A] text-[20px] text-black font-h1 hover:bg-[#F4C884]/80 transition"
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
</div>

          )
        })}
      </div>

{/* ===== Событие ===== */}
<div className="w-full flex flex-col items-center mt-[80px]">

  {events.length > 0 && (
    <div
      className="w-full relative flex flex-col items-center overflow-hidden"
      style={{
        backgroundImage: `url(${(selectedEvent || events[0]).imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* затемнение поверх общего фона */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>

      {/* =====================================================
          🔥 СТАТИЧНЫЙ ЗАГОЛОВОЧНЫЙ БЛОК (НЕ ДВИГАЕТСЯ)
      ====================================================== */}
      <div className="w-full h-[320px] flex flex-col items-center justify-center text-center relative z-10">

        <h2 className="text-[42px] font-['Zero_Cool'] text-[#F5C78B]">
          {(selectedEvent || events[0]).title}
        </h2>

        <p className="text-[62px] font-h1 text-[#F5C78B] mt-[10px]">
          {formatDate(new Date((selectedEvent || events[0]).startTime))}{" "}
          {formatTime((selectedEvent || events[0]).startTime)}–
          {formatTime((selectedEvent || events[0]).endTime)}
        </p>

        {!selectedEvent && (
          <div
            className="text-[#F5C78B] text-[46px] mt-[10px] cursor-pointer animate-bounce"
            onClick={() => setSelectedEvent(events[0])}
          >
            ▼
          </div>
        )}
      </div>

      {/* =====================================================
           🔥 АКТИВНЫЙ БЛОК ПОД ЗАГОЛОВКОМ
           ФОН НЕ ДУБЛИРУЕТСЯ (ОН УЖЕ НА РОДИТЕЛЕ)
      ====================================================== */}
      {selectedEvent && (
  <div className="w-full relative z-10  py-[80px]">

    <div className="max-w-[1400px] mx-auto flex">

      {/* ==== Левая часть — картинка ==== */}
      <div className="w-5/12 pr-[40px] flex items-start justify-end">
        
      </div>

      {/* ==== Правая часть — текст строго от центра ==== */}
      <div className="w-1/2 pl-[40px] flex flex-col text-white">


        <p className="text-[20px] leading-[28px] mb-[20px] whitespace-pre-line">
          {selectedEvent.description}
        </p>


        <p className="text-[32px] font-bold text-[#F5C78B] mb-[30px]">
          Стоимость: {selectedEvent.price ? `${selectedEvent.price} руб` : "Бесплатно"}
        </p>

        <button
  className="relative text-black text-[20px] font-bold w-fit h-fit flex items-center justify-center"
  style={{
    WebkitMaskImage: `url(${btnFrame})`,
    maskImage: `url(${btnFrame})`,
    WebkitMaskSize: "100% 100%",
    maskSize: "100% 100%",
    backgroundColor: "#F5C78B",  // ← цвет кнопки
    padding: "18px 48px",
  }}
>
  записаться
</button>


        <div
          onClick={() => setSelectedEvent(null)}
          className="text-[#F5C78B] text-[46px] mt-[40px] cursor-pointer hover:opacity-80"
        >
          ▲
        </div>
      </div>
    </div>
  </div>
)}

      {/* ===== Навигационные точки ===== */}
      {!selectedEvent && (
        <div className="flex justify-center gap-[14px] mt-[35px] relative z-10">
          {events.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedEvent(events[idx])}
              className={`w-[16px] h-[16px] rounded-full border-2 border-[#F5C78B] ${
                idx === 0 ? "bg-[#F5C78B]" : "bg-transparent"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )}
</div>

</div>
  )
}