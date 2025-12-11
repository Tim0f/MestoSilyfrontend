import { useState, useEffect } from "react";
import { freeVisitsService } from "../services/FreeVisitsFrontendService";
import { useAuth } from "../context/AuthContext";

// ===== SVG ИЗОБРАЖЕНИЯ / ИКОНКИ =====
import Parkur from "../assets/svg/parkur.svg";
import Border from "../assets/svg/texturedBorder.svg?react"; // РАМКА КАК REACT-КОМПОНЕНТ
import Border2 from "../components/border2";                 // ДРУГАЯ РАМКА (КОМПОНЕНТ)
import Border3 from "../assets/svg/numb.svg?react";          // НОМЕРА, ТОЖЕ КОМПОНЕНТ

// ===== КАРТИНКИ ДЛЯ СОБЫТИЙ =====
import Event1 from "../assets/img/Mask_group.png";
import Event2 from "../assets/img/Mask_group2.png";

// ===== КНОПКА =====
import btnFrame from "../assets/svg/Rectangle_9.svg";


// ==== Типы ====
interface Session {
  id: string | number
  sectionId?: string | number
  teacherId?: string | number
  date?: string            // original lesson.date (ISO)
  startTime: string        // full ISO datetime like "2025-12-14T12:00:00"
  endTime: string          // full ISO datetime like "2025-12-14T13:00:00"
  startsAt?: string        // original startsAt (e.g. "12:00")
  endsAt?: string
  capacity?: number
  currentEnrollment?: number
  section: { name: string }
  teacher: { name: string }
  location?: string
  iconUrl: string
}

interface Event {
  id: string | number
  title: string
  description?: string
  imageUrl?: string
  date?: string
  startTime?: string
  endTime?: string
  price?: number
}

export default function SchedulePage() {
  const [isApiAvailable, setIsApiAvailable] = useState(true)
  const [sessions, setSessions] = useState<Session[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [enrolledSessions, setEnrolledSessions] = useState<Array<string | number>>([])
  const [subscriptionCount, setSubscriptionCount] = useState<number>(0)
  const { isAuthenticated } = useAuth()

  // ==== Моки как fallback ====
  const mockSessions: Session[] = [
    {
      id: 1,
      sectionId: 10,
      teacherId: 5,
      startTime: '2025-12-14T10:00:00',
      endTime: '2025-12-14T11:00:00',
      startsAt: '10:00',
      endsAt: '11:00',
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
      startTime: '2025-14-12T14:00:00',
      endTime: '2025-14-12T15:00:00',
      startsAt: '14:00',
      endsAt: '15:00',
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
      startTime: '2025-12-14T18:00:00',
      endTime: '2025-12-14T19:30:00',
      startsAt: '18:00',
      endsAt: '19:30',
      capacity: 15,
      currentEnrollment: 12,
      section: { name: 'Пилатес' },
      teacher: { name: 'Мария' },
      location: 'Зал №1',
      iconUrl: Parkur,
    }
  ]

  const mockEvents: Event[] = [
    {
      id: 1,
      title: 'Мастер-класс по растяжке',
      description: 'Углублённая тренировка для всех уровней подготовки.',
      imageUrl: Event1,
      date: '2026-02-01',
      startTime: '18:00',
      endTime: '20:00',
      price: 500,
    },
    {
      id: 2,
      title: 'Йога на природе',
      description: 'Расслабляющая практика на свежем воздухе.',
      imageUrl: Event2,
      date: '2026-02-01',
      startTime: '09:00',
      endTime: '10:30'
    }
  ]

  const mockUserEnrollments: Array<number | string> = [1]

  // ==== Вспомогательные ф-ции для запроса ====
  function toISODateString(d: Date) {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }

  // Получить занятия на конкретную дату с бэка
  async function fetchSessionsFromApi(dateISO?: string): Promise<Session[] | null> {
    try {
      // Если дата передана — используем endpoint by-date
      const url = dateISO
        ? `http://localhost:3000/api/lessons/by-date?date=${encodeURIComponent(dateISO)}`
        : `http://localhost:3000/api/lessons`

      const res = await fetch(url)
      if (!res.ok) throw new Error('Ошибка сервера')

      const data = await res.json()
      if (!Array.isArray(data) || data.length === 0) return []

      // Мапим ответ в структуру Session (и собираем полные ISO-времена)
      return data.map((lesson: any) => {
        const datePart = (lesson.date ?? '').slice(0, 10) // "2025-12-14"
        const startsAt = lesson.startsAt ?? lesson.startTime ?? ''
        const endsAt = lesson.endsAt ?? lesson.endTime ?? ''

        // full ISO datetimes для корректного форматирования
        const startTimeFull = datePart && startsAt ? `${datePart}T${startsAt}:00` : (lesson.startsAt || lesson.startTime || '')
        const endTimeFull = datePart && endsAt ? `${datePart}T${endsAt}:00` : (lesson.endsAt || lesson.endTime || '')

        return {
          id: lesson.id,
          sectionId: lesson.sectionId ?? lesson.section?.id,
          teacherId: lesson.teacherId ?? lesson.teacher?.id,
          date: lesson.date,
          startTime: startTimeFull,
          endTime: endTimeFull,
          startsAt,
          endsAt,
          capacity: lesson.capacity ?? undefined,
          currentEnrollment: lesson.enrollments ? lesson.enrollments.length : (lesson.currentEnrollment ?? 0),
          section: { name: lesson.section?.name ?? 'Не указано' },
          teacher: { name: lesson.teacher ? `${lesson.teacher.firstName ?? ''} ${lesson.teacher.lastName ?? ''}`.trim() : 'Не указан' },
          location: lesson.location ?? '—',
          iconUrl: Parkur,
        } as Session
      })
    } catch (e) {
      console.warn('API недоступен. Использую mock.', e)
      return null
    }
  }

  // Получить события (берём все и фильтруем по дате на клиенте)
  async function fetchEventsFromApi(): Promise<Event[] | null> {
    try {
      const res = await fetch('http://localhost:3000/api/events')
      if (!res.ok) throw new Error('Ошибка сервера')

      const data = await res.json()
      if (!Array.isArray(data) || data.length === 0) return []

      return data.map((ev: any) => ({
        id: ev.id,
        title: ev.title,
        description: ev.description,
        imageUrl: ev.imageUrl ?? ev.bannerUrl ?? Event1,
        date: ev.date ? ev.date.slice(0, 10) : undefined,
        startTime: ev.startTime ?? ev.startTime,
        endTime: ev.endTime ?? ev.endTime,
        price: ev.price,
      }))
    } catch (e) {
      console.warn('API недоступен. Использую mock events.', e)
      return null
    }
  }

  // ==== Загрузка данных при выборе даты / монтировании ====
  useEffect(() => {
  async function loadData() {
    
    const dateISO = toISODateString(selectedDate)

// ---- ЗАНЯТИЯ ----
let apiSessions = await fetchSessionsFromApi(dateISO)

// Если API не работает — фиксируем это и используем mock
if (apiSessions === null) {
  setIsApiAvailable(false)
  apiSessions = mockSessions
} else {
  setIsApiAvailable(true)
}

// ---- СОБЫТИЯ ----
let apiEvents = await fetchEventsFromApi()
if (apiEvents === null) {
  apiEvents = mockEvents
}

setSessions(apiSessions)
setEvents(apiEvents)

// Если событие не выбрано — выбираем первое
if (!selectedEvent && apiEvents.length > 0) {
  setSelectedEvent(apiEvents[0])
}


    // ---- 🔥 ЕСЛИ API УПАЛ — БЕРЁМ ЗАГЛУШКИ БЕЗ ФИЛЬТРАЦИИ ----
    const finalSessions = apiSessions ?? mockSessions
    const finalEvents = apiEvents ?? mockEvents

    setSessions(finalSessions)
    setEvents(finalEvents)

    // Если событие не выбрано — выбираем первое (с API или mock)
    if (!selectedEvent && finalEvents.length > 0) {
      setSelectedEvent(finalEvents[0])
    }

    // ---- 🔥 FREE VISITS / SUBSCRIPTIONS ----
    if (isAuthenticated) {
      const userId = localStorage.getItem('userId')

      if (userId) {
        try {
          const visits = await freeVisitsService.getUserFreeVisits(userId)
          setSubscriptionCount(visits?.available ?? 0)
        } catch {
          console.warn("Free Visits упали → ставим 0")
          setSubscriptionCount(0)
        }
      }
    } else {
      setSubscriptionCount(0)
    }

    // ---- 🔥 ENROLLMENTS ----
    if (isAuthenticated) {
      try {
        setEnrolledSessions(mockUserEnrollments)
      } catch {
        setEnrolledSessions([])
      }
    } else {
      setEnrolledSessions([])
    }
  }

  loadData()
}, [selectedDate, isAuthenticated])



  const handleEnroll = (sessionId: string | number) => {
    if (!isAuthenticated) {
      alert('Пожалуйста, войдите в систему')
      return
    }
    // Тут можно вызвать реальный endpoint для записи.
    alert('Заглушка: записываем на занятие')
    setEnrolledSessions(prev => [...prev, sessionId])
  }

  // ==== Форматирование ====
  const formatDate = (d: Date) =>
    d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'numeric' })

  const formatTime = (isoOrString: string) => {
    try {
      const dt = new Date(isoOrString)
      if (isNaN(dt.getTime())) {
        // если не валидный Date, попытаемся показать как есть (HH:mm)
        return isoOrString.slice(0,5)
      }
      return dt.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    } catch {
      return isoOrString.slice(0,5)
    }
  }

  // ==== Генерация дней недели (неделя от selectedDate) ====
  const getWeekDates = () => {
    const dates: Date[] = []
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

  // Фильтрация: показываем только занятия на выбранную дату
  const selectedISO = toISODateString(selectedDate)
// Определяем валидность API
const filteredSessions = isApiAvailable
  ? sessions.filter(s => {
      const lessonDate = (s.date ?? '').slice(0, 10)
      return lessonDate === selectedISO
    })
  : sessions; // ← ПРИ ЗАГЛУШКАХ ПОКАЗЫВАЕМ ВСЕ


  // ==== JSX (Дизайн не менял) ====
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

          `}
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
    const isEnrolled = enrolledSessions.includes(session.id); // ✔ ВОТ ЭТО ВЕРНУЛ

    return (
      <div
        key={session.id}
        className={`w-[520px] h-[560px] p-[40px] relative 
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
          <div className="w-1/2 flex flex-col">

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
            <div className="pt-[20px]">
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
    );
  })}

</div>



{/* ===== Событие ===== */}
<div className="w-full flex flex-col items-center mt-[80px]">

  {events.length > 0 && (
    <div
      className="w-full relative flex flex-col items-center overflow-hidden"
      style={{
        backgroundImage: `url(${(selectedEvent ?? events[0]).imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>

      {/* 🔥 СТАТИЧНЫЙ ЗАГОЛОВОК */}
      <div className="w-full h-[320px] flex flex-col items-center justify-center text-center relative z-10">

        <h2 className="text-[42px] font-['Zero_Cool'] text-[#F5C78B]">
          {(selectedEvent ?? events[0]).title}
        </h2>

        {/* ✔ ДАТА ИЗ СОБЫТИЯ, А НЕ ИЗ ВЫБРАННОЙ ДАТЫ */}
        <p className="text-[62px] font-h1 text-[#F5C78B] mt-[10px]">
          {(() => {
            const ev = selectedEvent ?? events[0];
            const date = ev.date ? new Date(ev.date) : null;
            return date ? formatDate(date) : "—";
          })()}{" "}
          {formatTime((selectedEvent ?? events[0]).startTime ?? "")}–
          {formatTime((selectedEvent ?? events[0]).endTime ?? "")}
        </p>

        {/* 🔻 ПОКАЗЫВАЕТСЯ ТОЛЬКО ЕСЛИ selectedEvent == null */}
        {!selectedEvent && (
          <div
            className="text-[#F5C78B] text-[46px] mt-[10px] cursor-pointer animate-bounce"
            onClick={() => setSelectedEvent(events[0])}
          >
            ▼
          </div>
        )}
      </div>

      {/* 🔥 АКТИВНЫЙ РАЗВЕРНУТЫЙ БЛОК */}
      {selectedEvent && (
        <div className="w-full relative z-10 py-[80px]">
          <div className="max-w-[1400px] mx-auto flex">

            <div className="w-5/12 pr-[40px] flex items-start justify-end"></div>

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
                  backgroundColor: "#F5C78B",
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

      {/* 🔘 ТОЧКИ (НЕ ЗАВИСЯТ ОТ selectedDate) */}
      {!selectedEvent && (
        <div className="flex justify-center gap-[14px] mt-[35px] relative z-10">
          {events.map((ev, idx) => (
            <button
              key={ev.id}
              onClick={() => setSelectedEvent(ev)}
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
