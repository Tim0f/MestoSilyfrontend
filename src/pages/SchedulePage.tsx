import React, { useEffect, useState } from "react";
import { Client } from "../services/httpClient"; // путь к твоему HttpClient (Client)
import { freeVisitsService } from "../services/FreeVisitsFrontendService";
import { useAuth } from "../context/AuthContext";

// ===== SVG / Иконки / Картинки (твоё окружение) =====
import Parkur from "../assets/svg/parkur.svg";
import Border from "../assets/svg/texturedBorder.svg?react";
import Border2 from "../components/border2";
import Border3 from "../components/border3";
import Event1 from "../assets/img/Mask_group.png";
import Event2 from "../assets/img/Mask_group2.png";
import btnFrame from "../assets/svg/Rectangle_9.svg";

// ==== Типы ====
interface Session {
  id: string | number;
  sectionId?: string | number;
  teacherId?: string | number;
  date?: string;
  startTime: string;
  endTime: string;
  startsAt?: string;
  endsAt?: string;
  capacity?: number;
  currentEnrollment?: number;
  section: { name: string };
  teacher: { name: string };
  location?: string;
  iconUrl: string;
}

interface Event {
  id: string | number;
  title: string;
  description?: string;
  imageUrl?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  price?: number;
}

// ===== Утилиты =====
function toISODateString(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const formatDate = (d: Date) =>
  d.toLocaleDateString("ru-RU", { day: "numeric", month: "numeric" });

const formatTime = (isoOrString: string) => {
  try {
    const dt = new Date(isoOrString);
    if (!isNaN(dt.getTime())) {
      return dt.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
    }
  } catch {}
  return isoOrString ? isoOrString.slice(0, 5) : "—";
};

// ===== SchedulePage (всё внутри) =====
export default function SchedulePage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [enrolledSessions, setEnrolledSessions] = useState<Array<string | number>>([]);
  const [subscriptionCount, setSubscriptionCount] = useState<number>(0);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [errorSessions, setErrorSessions] = useState<string | null>(null);

  const { isAuthenticated } = useAuth();

  // ==== API: занятия (через Client) ====
  async function fetchSessionsFromApi(dateISO?: string): Promise<Session[] | null> {
    try {
      // используем твой HttpClient Client
      const payload = await Client.get<any[]>("/lessons/by-date", {
        query: { date: dateISO, sectionId: "" }, // пустой sectionId — снимает фильтрацию
        authenticate: true,
      });

      if (!Array.isArray(payload)) return null;

      // приводим в наш формат Session
      return payload.map((lesson: any) => {
        const datePart = (lesson.date ?? "").slice(0, 10);
        const startsAt = lesson.startsAt ?? lesson.startTime ?? "";
        const endsAt = lesson.endsAt ?? lesson.endTime ?? "";

        const startTimeFull = datePart && startsAt ? `${datePart}T${startsAt}:00` : lesson.startTime ?? "";
        const endTimeFull = datePart && endsAt ? `${datePart}T${endsAt}:00` : lesson.endTime ?? "";

        return {
          id: lesson.id,
          sectionId: lesson.sectionId ?? lesson.section?.id,
          teacherId: lesson.teacherId ?? lesson.teacher?.id,
          date: lesson.date,
          startTime: startTimeFull,
          endTime: endTimeFull,
          startsAt,
          endsAt,
          capacity: lesson.capacity,
          currentEnrollment: lesson.enrollments ? lesson.enrollments.length : (lesson.currentEnrollment ?? 0),
          section: { name: lesson.section?.name ?? "Не указано" },
          teacher: { name: lesson.teacher ? `${lesson.teacher.firstName ?? ""} ${lesson.teacher.lastName ?? ""}`.trim() : "Не указан" },
          location: lesson.location ?? "—",
          iconUrl: Parkur,
        } as Session;
      });
    } catch (e: any) {
      console.warn("fetchSessionsFromApi error", e);
      // если сервер вернул объект с message (например 401), пробросим
      throw e;
    }
  }

  // ==== API: события ====
  async function fetchEventsFromApi(): Promise<Event[] | null> {
    try {
      const payload = await Client.get<any[]>("/events", { authenticate: true });
      if (!Array.isArray(payload)) return null;
      return payload.map((ev: any) => ({
        id: ev.id,
        title: ev.title,
        description: ev.description,
        imageUrl: ev.imageUrl ?? ev.bannerUrl ?? Event1,
        date: ev.date ? ev.date.slice(0, 10) : undefined,
        startTime: ev.startTime,
        endTime: ev.endTime,
        price: ev.price,
      }));
    } catch (e) {
      console.warn("fetchEventsFromApi error", e);
      return null;
    }
  }

  // ==== Load data ====
  useEffect(() => {
    let mounted = true;

    async function loadData() {
      const dateISO = toISODateString(selectedDate);

      setLoadingSessions(true);
      setErrorSessions(null);

      try {
        const apiSessions = await fetchSessionsFromApi(dateISO);
        if (!mounted) return;
        setSessions(apiSessions ?? []);
      } catch (e: any) {
        // если 401 — покажем сообщение в консоли и в UI
        if (e?.status === 401 || e?.statusCode === 401) {
          setErrorSessions("Неавторизован. Пожалуйста, войдите в систему.");
        } else {
          setErrorSessions("Ошибка при загрузке занятий");
        }
        setSessions([]);
      } finally {
        if (mounted) setLoadingSessions(false);
      }

      setLoadingEvents(true);
      try {
        const apiEvents = await fetchEventsFromApi();
        if (!mounted) return;
        setEvents(apiEvents ?? []);
        if (!selectedEvent && apiEvents && apiEvents.length > 0) {
          setSelectedEvent(apiEvents[0]);
        }
      } finally {
        if (mounted) setLoadingEvents(false);
      }

      // free visits
      if (isAuthenticated) {
        const userId = localStorage.getItem("userId");
        if (userId) {
          try {
            const visits = await freeVisitsService.getUserFreeVisits(userId);
            if (mounted) setSubscriptionCount(visits?.available ?? 0);
          } catch {
            if (mounted) setSubscriptionCount(0);
          }
        }
      } else {
        setSubscriptionCount(0);
      }

      // enrolled sessions — пока пусто, в ожидании реального API
      setEnrolledSessions([]);
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, [selectedDate, isAuthenticated]);

  // ==== Локальные UI-хендлеры ====
  const weekDates = (() => {
    const dates: Date[] = [];
    const current = new Date(selectedDate);
    const day = current.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    current.setDate(current.getDate() + diffToMonday);
    for (let i = 0; i < 7; i++) {
      const d = new Date(current);
      d.setDate(current.getDate() + i);
      dates.push(d);
    }
    return dates;
  })();

  const selectedISO = toISODateString(selectedDate);
  const filteredSessions = sessions.filter((s) => ((s.date ?? "").slice(0,10)) === selectedISO);

  const handleEnroll = (sessionId: string | number) => {
    if (!isAuthenticated) {
      alert("Пожалуйста, войдите в систему");
      return;
    }
    // Тут можно вызвать реальный endpoint для записи.
    alert("Заглушка: записываем на занятие");
    setEnrolledSessions(prev => [...prev, sessionId]);
  };

  // ==== JSX ====
  return (
    <div className="w-full min-h-screen bg-customblack text-white font-['Unbounded'] flex flex-col items-center pb-[200px]">

      <h1 className="mt-[120px] text-[96px] font-h1 text-customyellow text-center">РАСПИСАНИЕ</h1>

      <div className="flex items-center gap-[40px] mt-6">

        <div className="flex items-center gap-[20px]">
          <span className="text-[24px] text-white">Кол-во бесплатных посещений:</span>
          <Border3 className="w-[95px] h-[85px] fill-customyellow stroke-customyellow flex justify-center items-center">
            <span className="text-[28px] font-h1 text-black leading-none">{subscriptionCount}</span>
          </Border3>
        </div>

        <div className="flex items-center gap-[28px]">
          <div className="flex gap-[18px]">
            {weekDates.map((date, i) => {
              const isActive = date.toDateString() === selectedDate.toDateString();
              const dayName = date.toLocaleDateString("ru-RU", { weekday: "short" });

              return (
                <button key={i} onClick={() => setSelectedDate(date)} className="w-[95px] h-[85px] flex flex-col justify-center items-center">
                  <Border2 className={`${isActive ? "fill-customblack" : "fill-customyellow"} stroke-customyellow`}>
                    <span className="text-[26px] font-h1 text-black leading-none">{date.getDate()}</span>
                    <span className="text-[15px] mt-[3px] uppercase">{dayName}</span>
                  </Border2>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-[16px] text-[#F4C884]">
            <button onClick={() => { const d = new Date(selectedDate); d.setDate(d.getDate() - 7); setSelectedDate(d); }} className="text-[30px]">&lt;</button>
            <span className="text-[20px]">{formatDate(weekDates[0])} - {formatDate(weekDates[6])}</span>
            <button onClick={() => { const d = new Date(selectedDate); d.setDate(d.getDate() + 7); setSelectedDate(d); }} className="text-[30px]">&gt;</button>
          </div>
        </div>
      </div>

      {/* Сообщения об ошибке / загрузке */}
      {errorSessions && (
        <div className="text-red-400 mt-[30px] text-center">{errorSessions}</div>
      )}

      {/* Если нет занятий */}
      {!loadingSessions && filteredSessions.length === 0 && !errorSessions && (
        <div className="text-center text-[32px] text-customyellow mt-[60px]">
          На этот день занятий нет
        </div>
      )}

      {/* Карточки занятий */}
      {filteredSessions.length > 0 && (
        <div className="mt-[60px] w-full h-full max-w-[1600px] flex justify-center gap-[40px] flex-wrap">
          {filteredSessions.map(session => {
            const isEnrolled = enrolledSessions.includes(session.id);

            return (
              <div key={session.id} className={`w-[520px] h-[560px] p-[40px] relative ${isEnrolled ? 'bg-customyellow text-black' : 'bg-customblack text-white'}`}
                style={{ backgroundImage: `url(${Border})`, backgroundSize: "100% 100%", backgroundRepeat: "no-repeat" }}>
                <div className="flex w-full h-full">
                  <div className="w-1/2 flex items-center justify-center">
                    <div aria-hidden className="w-[220px] h-[480px] select-none pointer-events-none"
                      style={{
                        WebkitMaskImage: `url(${session.iconUrl})`,
                        maskImage: `url(${session.iconUrl})`,
                        WebkitMaskSize: "contain",
                        maskSize: "contain",
                        WebkitMaskRepeat: "no-repeat",
                        maskRepeat: "no-repeat",
                        WebkitMaskPosition: "center",
                        maskPosition: "center",
                        backgroundColor: isEnrolled ? '#2D282A' : '#F4C884',
                      }} />
                  </div>

                  <div className="w-1/2 flex flex-col">
                    <div>
                      <span className={`text-[72px] font-['Zero_Cool'] leading-[80px] ${isEnrolled ? 'text-black' : 'text-customyellow'}`}>
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

                    <div className="mt-[20px] flex items-center gap-[12px]">
                      <div>
                        <div className="text-customyellow font-p">Учитель:</div>
                        <div className="text-customwhite font-p">{session.teacher.name}</div>
                      </div>
                    </div>

                    <div className="pt-[20px]">
                      {!isEnrolled ? (
                        <button onClick={() => handleEnroll(session.id)} className="w-[213px] h-[73px] bg-[#F4C884] mx-auto rounded-[5px] border-2 border-customblack text-[20px] text-black font-h1 hover:bg-[#F4C884]/80 transition">
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
      )}

      {/* События — показываем ТОЛЬКО если events.length > 0 */}
      {events.length > 0 && (
        <div className="w-full flex flex-col items-center mt-[80px]">
          <div className="w-full relative flex flex-col items-center overflow-hidden" style={{ backgroundImage: `url(${(selectedEvent ?? events[0]).imageUrl ?? Event1})`, backgroundSize: "cover", backgroundPosition: "center" }}>
            <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>

            <div className="w-full h-[320px] flex flex-col items-center justify-center text-center relative z-10">
              <h2 className="text-[42px] font-['Zero_Cool'] text-customyellow">{(selectedEvent ?? events[0]).title}</h2>

              <p className="text-[62px] font-h1 text-customyellow mt-[10px]">
                {(() => { const ev = selectedEvent ?? events[0]; const date = ev.date ? new Date(ev.date) : null; return date ? formatDate(date) : "—"; })()}{" "}
                {formatTime((selectedEvent ?? events[0]).startTime ?? "")}–{formatTime((selectedEvent ?? events[0]).endTime ?? "")}
              </p>

              {/* стрелка для разворачивания */}
              {!selectedEvent && (
                <div className="text-customyellow text-[46px] mt-[10px] cursor-pointer animate-bounce" onClick={() => setSelectedEvent(events[0])}>▼</div>
              )}
            </div>

            {/* Развернутый блок — кнопка показывается ТОЛЬКО здесь */}
            {selectedEvent && (
              <div className="w-full relative z-10 py-[80px]">
                <div className="max-w-[1400px] mx-auto flex">
                  <div className="w-5/12 pr-[40px] flex items-start justify-end"></div>

                  <div className="w-1/2 pl-[40px] flex flex-col text-white">
                    <p className="text-[20px] leading-[28px] mb-[20px] whitespace-pre-line">{selectedEvent.description}</p>

                    <p className="text-[32px] font-bold text-customyellow mb-[30px]">
                      Стоимость: {selectedEvent.price ? `${selectedEvent.price} руб` : "Бесплатно"}
                    </p>

                    <button className="bg-customyellow relative text-black text-[20px] font-bold w-fit h-fit flex items-center justify-center"
                      style={{ WebkitMaskImage: `url(${btnFrame})`, maskImage: `url(${btnFrame})`, WebkitMaskSize: "100% 100%", maskSize: "100% 100%", padding: "18px 48px" }}>
                      записаться
                    </button>

                    <div onClick={() => setSelectedEvent(null)} className="text-customyellow text-[46px] mt-[40px] cursor-pointer hover:opacity-80">▲</div>
                  </div>
                </div>
              </div>
            )}

            {/* точки */}
            {!selectedEvent && (
              <div className="flex justify-center gap-[14px] mt-[35px] relative z-10">
                {events.map((ev, idx) => (
                  <button key={ev.id} onClick={() => setSelectedEvent(ev)} className={`w-[16px] h-[16px] rounded-full border-2 border-customyellow ${idx === 0 ? "bg-customyellow" : "bg-transparent"}`} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
