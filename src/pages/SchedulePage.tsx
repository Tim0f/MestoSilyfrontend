// src/pages/SchedulePage.tsx
import  { useEffect, useState } from "react";
import { Client } from "../services/httpClient";
import { freeVisitsService } from "../services/FreeVisitsFrontendService";
import { useAuth } from "../context/AuthContext";

import Parkur from "../assets/svg/parkur.svg"; // fallback icon (string path)
import BorderUrl from "../assets/svg/texturedBorder.svg"; // src for <img>
import Border2 from "../components/border2";
import Border3 from "../components/border3";
import Event1 from "../assets/img/Mask_group.png";
import btnFrame from "../assets/svg/Rectangle_9.svg";

import { EnrollmentsFrontendService } from "../services/enrollments.service";
import { EventsFrontendService } from "../services/events.service";
// import { LessonsFrontendService } from "../services/lessons.service";

// сервисы
const enrollmentsService = new EnrollmentsFrontendService(Client);
const eventsService = new EventsFrontendService(Client);
// const lessonsService = new LessonsFrontendService(Client);

// ==========================
// Типы
// ==========================
interface BackendEnrollmentRecord {
  id: string;
  userId?: string;
  sectionId?: string;
  lessonId?: string | null;
  eventId?: string | null;
  // include from backend:
  section?: { id: string; name?: string; iconUrl?: string };
  lesson?: { id: string; startsAt?: string; endsAt?: string; teacher?: any } | null;
  event?: { id: string } | null;
}

// interface MyEnrollment {
//   lessonId?: string | number | null;
//   eventId?: string | number | null;
//   sectionId?: string | number | null;
// }

interface Session {
  id: string;
  sectionId: string;
  teacherId: string;

  date: string;    // ISO date string from backend
  startsAt: string; // "HH:MM"
  endsAt: string;   // "HH:MM"

  startTime?: string; // optional full ISO date-time string
  endTime?: string;

  location: string;
  capacity: number;
  description: string;

  enrollments: any[]; // backend enrollments array
  currentEnrollment?: number;
  price?: number;

  section: {
    id: string;
    name: string;
    description?: string;
    imageUrl?: string;
    iconUrl?: string; // url to icon (svg/png)
    galleryDriveUrl?: string;
    ageMin?: number;
    ageMax?: number;
    maxParticipants?: number;
    isActive?: boolean;
  };

  teacher: {
    id: string;
    firstName?: string;
    lastName?: string;
    middleName?: string;
    phone?: string;
    photoUrl?: string;
    audioUrl?: string;
  };
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

// ==========================
// Утилиты
// ==========================
const toISODateString = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
};

const formatDate = (d: Date) =>
  d.toLocaleDateString("ru-RU", { day: "numeric", month: "numeric" });

const formatTime = (val?: string) => {
  if (!val) return "—";
  try {
    const dt = new Date(val);
    if (!isNaN(dt.getTime())) {
      return dt.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
    }
  } catch {}
  return val.slice(0, 5);
};

function calcDuration(start?: string, end?: string): number {
  if (!start || !end) return 0;
  const [h1 = 0, m1 = 0] = start.split(":").map(Number);
  const [h2 = 0, m2 = 0] = end.split(":").map(Number);
  const t1 = (h1 || 0) * 60 + (m1 || 0);
  const t2 = (h2 || 0) * 60 + (m2 || 0);
  const diff = t2 - t1;
  return Math.max(1, Math.round(diff / 60));
}

// ================================================================
// SchedulePage
// ================================================================
export default function SchedulePage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [enrolledSessions, setEnrolledSessions] = useState<Array<string | number>>([]);
  const [enrolledEventIds, setEnrolledEventIds] = useState<Array<string | number>>([]);
  const [subscriptionCount, setSubscriptionCount] = useState<number>(0);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [errorSessions, setErrorSessions] = useState<string | null>(null);

  const { isAuthenticated } = useAuth();

  // --- загрузка занятий по дате
  async function fetchSessionsFromApi(dateISO?: string): Promise<Session[] | null> {
    try {
      const payload = await Client.get<any[]>("/lessons/by-date", {
        query: { date: dateISO, sectionId: "" },
        authenticate: true,
      });

      if (!Array.isArray(payload)) return null;

      return payload.map((lesson: any) => {
        const datePart = (lesson.date ?? "").slice(0, 10);
        const startsAt = lesson.startsAt ?? lesson.startTime ?? "";
        const endsAt = lesson.endsAt ?? lesson.endTime ?? "";

        const startTimeFull = datePart && startsAt ? `${datePart}T${startsAt}:00` : lesson.startTime;
        const endTimeFull = datePart && endsAt ? `${datePart}T${endsAt}:00` : lesson.endTime;

        const section = lesson.section ?? {};
        const teacher = lesson.teacher ?? {};

        return {
          id: lesson.id,
          sectionId: lesson.sectionId ?? section.id ?? "",
          teacherId: lesson.teacherId ?? teacher.id ?? "",

          date: lesson.date ?? "",
          startsAt,
          endsAt,
          startTime: startTimeFull,
          endTime: endTimeFull,

          location: lesson.location ?? "—",
          capacity: lesson.capacity ?? 0,
          description: lesson.description ?? section.description ?? "",
          price: lesson.price ?? 1100,

          enrollments: lesson.enrollments ?? [],
          currentEnrollment: (lesson.enrollments ?? []).length,

          section: {
            id: section.id ?? "",
            name: section.name ?? "Не указано",
            description: section.description ?? "",
            imageUrl: section.imageUrl ?? "",
            iconUrl: section.iconUrl ?? Parkur,
            galleryDriveUrl: section.galleryDriveUrl ?? "",
            ageMin: section.ageMin ?? 0,
            ageMax: section.ageMax ?? 0,
            maxParticipants: section.maxParticipants ?? 0,
            isActive: section.isActive ?? true,
          },

          teacher: {
            id: teacher.id ?? "",
            firstName: teacher.firstName ?? "",
            lastName: teacher.lastName ?? "",
            middleName: teacher.middleName ?? "",
            phone: teacher.phone ?? "",
            photoUrl: teacher.photoUrl ?? "",
            audioUrl: teacher.audioUrl ?? "",
          },
        } as Session;
      });
    } catch (e: any) {
      throw e;
    }
  }

  // --- загрузка событий
  async function fetchEventsFromApi(): Promise<Event[] | null> {
    try {
      const payload = await Client.get<any[]>("/events", { authenticate: true });
      if (!Array.isArray(payload)) return null;
      return payload.map((ev: any) => ({
        id: ev.id,
        title: ev.title,
        description: ev.description,
        imageUrl: ev.imageUrl ?? ev.bannerUrl ?? Event1,
        date: ev.date?.slice(0, 10),
        startTime: ev.startTime,
        endTime: ev.endTime,
        price: ev.price,
      }));
    } catch (e) {
      console.warn("fetchEventsFromApi error", e);
      return null;
    }
  }

 // --- загрузка моих записей
// --- загрузка моих записей
const loadMyEnrollments = async (): Promise<void> => {
  try {
    const arr = await enrollmentsService.getMyEnrollments<BackendEnrollmentRecord[]>();

    // запишем тип для r, чтобы не было implicit any
    const lessonIds = arr
      .filter((r: BackendEnrollmentRecord) => r.lessonId != null)
      .map((r: BackendEnrollmentRecord) => r.lessonId as string | number);

    const sectionOnlyIds = arr
      .filter((r: BackendEnrollmentRecord) => !r.lessonId && r.sectionId)
      .map((r: BackendEnrollmentRecord) => r.sectionId as string | number);

    const eventIds = arr
      .filter((r: BackendEnrollmentRecord) => r.eventId != null)
      .map((r: BackendEnrollmentRecord) => r.eventId as string | number);

    setEnrolledSessions([...lessonIds, ...sectionOnlyIds]);
    setEnrolledEventIds(eventIds);
  } catch (err) {
    console.error("Ошибка загрузки записей:", err);
    setEnrolledSessions([]);
    setEnrolledEventIds([]);
  }
};



  // LOAD DATA useEffect
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
        if (e?.status === 401 || e?.statusCode === 401) {
          setErrorSessions("Неавторизован. Войдите в систему.");
        } else {
          setErrorSessions("Ошибка при загрузке занятий");
        }
        setSessions([]);
      } finally {
        mounted && setLoadingSessions(false);
      }

      const ev = await fetchEventsFromApi();
      if (mounted) {
        setEvents(ev ?? []);
        if (!selectedEvent && ev && ev.length > 0) setSelectedEvent(ev[0]);
      }

      if (isAuthenticated) {
        await loadMyEnrollments();
        const uid = localStorage.getItem("userId");
        if (uid) {
          try {
            const visits = await freeVisitsService.getUserFreeVisits(uid);
            mounted && setSubscriptionCount(visits?.available ?? 0);
          } catch {
            mounted && setSubscriptionCount(0);
          }
        }
      } else {
        setEnrolledSessions([]);
        setEnrolledEventIds([]);
        setSubscriptionCount(0);
      }
    }

    loadData();
    return () => {
      mounted = false;
    };
  }, [selectedDate, isAuthenticated]);

  // ====== запись на урок ======
  const enrollToLesson = async (session: Session) => {
    if (!isAuthenticated) {
      alert("Пожалуйста, войдите в систему");
      return;
    }

    try {
      if (enrolledSessions.includes(session.id)) {
        alert("Вы уже записаны");
        return;
      }

      const payload = { sectionId: session.section.id, lessonId: session.id };
      await enrollmentsService.enroll(payload);

      // обновляем локально
      setEnrolledSessions((prev) => [...prev, session.id]);
      setSessions((prev) =>
        prev.map((s) =>
          s.id === session.id ? { ...s, currentEnrollment: (s.currentEnrollment ?? 0) + 1 } : s
        )
      );

      // также обновим список записей на случай, если бэкенд вернёт дополнительные поля
      await loadMyEnrollments();

      alert("Вы успешно записаны на занятие");
    } catch (err: any) {
      console.error("enrollToLesson error", err);
      const msg = err?.details?.message ?? err?.message ?? "Ошибка записи";
      alert(msg);
    }
  };

  // ====== регистрация на событие ======
  const registerForEvent = async (eventId: string | number) => {
    if (!isAuthenticated) {
      alert("Пожалуйста, войдите в систему");
      return;
    }

    try {
      if (enrolledEventIds.includes(eventId)) {
        await eventsService.cancelRegistration(String(eventId));
        setEnrolledEventIds((prev) => prev.filter((id) => id !== eventId));
        alert("Вы отменили регистрацию");
        return;
      }

      await eventsService.registerForEvent(String(eventId));
      setEnrolledEventIds((prev) => [...prev, eventId]);
      alert("Успешно зарегистрированы на событие");
    } catch (err: any) {
      console.error("registerForEvent error", err);
      alert(err?.message ?? "Ошибка регистрации");
    }
  };

  // helpers for week
  const weekDates = (() => {
    const arr: Date[] = [];
    const c = new Date(selectedDate);
    const wd = c.getDay();
    const diff = wd === 0 ? -6 : 1 - wd;
    c.setDate(c.getDate() + diff);
    for (let i = 0; i < 7; i++) {
      const d = new Date(c);
      d.setDate(c.getDate() + i);
      arr.push(d);
    }
    return arr;
  })();

  const selectedISO = toISODateString(selectedDate);
  const filteredSessions = sessions.filter((s) => (s.date ?? "").slice(0, 10) === selectedISO);

  // ===========================
  // РЕНДЕР
  // ===========================
  return (
    <div className="w-full min-h-screen bg-customblack text-white font-['Unbounded'] flex flex-col items-center pb-[200px]">
      <h1 className="mt-[120px] text-[96px] font-h1 text-customyellow text-center">РАСПИСАНИЕ</h1>

      {/* верхняя панель */}
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

      {/* ошибки */}
      {errorSessions && <div className="text-red-400 mt-[30px] text-center">{errorSessions}</div>}

      {/* нет занятий */}
      {!loadingSessions && filteredSessions.length === 0 && !errorSessions && (
        <div className="text-center text-[32px] text-customyellow mt-[60px]">На этот день занятий нет</div>
      )}

      {/* карточки занятий */}
      {filteredSessions.length > 0 && (
        <div className="mt-[60px] w-full max-w-[1600px] flex justify-center gap-[40px] flex-wrap">
          {filteredSessions.map((session) => {
            const isEnrolled = enrolledSessions.includes(session.id);
            return (
              <div
                key={session.id}
                className={`relative w-[520px] h-[560px] p-[40px] ${isEnrolled ? "text-black" : "text-white"}`}
              >
                {/* рамка (img сверху) */}
                <img src={BorderUrl} alt="" className="absolute inset-0 w-full h-full z-20 pointer-events-none" />

                {/* фон под рамкой */}
                <div className={`absolute inset-0 ${isEnrolled ? "bg-customyellow" : "bg-customblack"}`} />

                {/* контент поверх */}
                <div className="relative z-10 flex w-full h-full">
                  {/* левая часть - иконка секции (mask) */}
                  <div className="w-1/2 flex items-center justify-center">
                    <div
                      className="w-[220px] h-[480px] select-none"
                      style={{
                        WebkitMaskImage: `url(${session.section.iconUrl ?? Parkur})`,
                        maskImage: `url(${session.section.iconUrl ?? Parkur})`,
                        WebkitMaskSize: "contain",
                        maskSize: "contain",
                        WebkitMaskRepeat: "no-repeat",
                        maskRepeat: "no-repeat",
                        WebkitMaskPosition: "center",
                        maskPosition: "center",
                        backgroundColor: isEnrolled ? "#2D282A" : "#F4C884",
                      }}
                    />
                  </div>

                  {/* правая часть - текст */}
                  <div className="w-1/2 flex flex-col">
                    <div>
                      <span className={`text-h1 font-h1 leading-[80px] ${isEnrolled ? "text-customblack" : "text-customyellow"}`}>
                        {formatTime(session.startsAt)}
                      </span>

                      <div className={` text-p font-p -mt-2   ${isEnrolled ? "text-black" : "text-customyellow"}`}>
                        длительность: {calcDuration(session.startsAt, session.endsAt)} часа
                      </div>
                    </div>

                    <h3 className={`text-h2 font-h2  mt-[10px] ${isEnrolled ? "text-customblack" : "text-customwhite"}`}>{session.section.name}</h3>

                    <p className={`text-p font-p mt-[10px] max-w-[280px]  leading-[20px] ${isEnrolled ? "text-customblack" : "text-customwhite"}`}>
                      {session.description}
                    </p>

                    <div className="mt-[20px] flex items-center gap-[12px]">
                      {session.teacher.photoUrl ? (
                        <img src={session.teacher.photoUrl} alt={`${session.teacher.firstName ?? ""}`} className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#F4C884]" />
                      )}

                      <div>
                        <div className={`text-p font-p ${isEnrolled ? "text-customblack" : "text-customwhite"}`}>
                          {session.teacher.lastName ?? ""} {session.teacher.firstName ?? ""} {session.teacher.middleName ?? ""}
                        </div>
                      </div>
                    </div>

                    <div className={`text-h2 font-h2 mt-[20px] ${isEnrolled ? "text-customblack" : "text-customwhite"}`}>
                      {session.price} руб
                    </div>

                    <div className="pt-[10px]">
                      {!isEnrolled ? (
                        <button
                          onClick={() => enrollToLesson(session)}
                          className="w-[213px] h-[73px] bg-customyellow mx-auto rounded-[5px] text-p text-customblack font-p hover:bg-[#F4C884]/80 transition"
                        >
                          записаться
                        </button>
                      ) : (
                        <div className="w-[213px] h-[73px] bg-customblack mx-auto rounded-[5px] flex items-center justify-center">
                          <span className="text-p font-p text-customyellow">записан(а)</span>
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

      {/* события */}
      {events.length > 0 && (
        <div className="w-full flex flex-col items-center mt-[80px]">
          <div className="w-full relative flex flex-col items-center overflow-hidden" style={{ backgroundImage: `url(${(selectedEvent ?? events[0]).imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }}>
            <div className="absolute inset-0 bg-black/40" />

            <div className="w-full h-[320px] flex flex-col items-center justify-center text-center relative z-10">
              <h2 className="text-[42px] font-['Zero_Cool'] text-customyellow">{(selectedEvent ?? events[0]).title}</h2>

              <p className="text-[62px] font-h1 text-customyellow mt-[10px]">
                {(() => {
                  const ev = selectedEvent ?? events[0];
                  const d = ev.date ? new Date(ev.date) : null;
                  return d ? formatDate(d) : "—";
                })()}{" "}
                {formatTime((selectedEvent ?? events[0]).startTime ?? "")}–{formatTime((selectedEvent ?? events[0]).endTime ?? "")}
              </p>

              {!selectedEvent && (
                <div className="text-customyellow text-[46px] mt-[10px] cursor-pointer animate-bounce" onClick={() => setSelectedEvent(events[0])}>▼</div>
              )}
            </div>

            {selectedEvent && (
              <div className="w-full relative z-10 py-[80px]">
                <div className="max-w-[1400px] mx-auto flex">
                  <div className="w-5/12" />
                  <div className="w-1/2 pl-[40px] text-white flex flex-col">
                    <p className="text-[20px] leading-[28px] mb-[20px] whitespace-pre-line">{selectedEvent.description}</p>

                    <p className="text-[32px] font-bold text-customyellow mb-[30px]">Стоимость: {selectedEvent.price ? `${selectedEvent.price} руб` : "Бесплатно"}</p>

                    <button
                      onClick={() => registerForEvent(selectedEvent.id)}
                      className="bg-customyellow relative text-black text-[20px] font-bold w-fit h-fit flex items-center justify-center"
                      style={{ WebkitMaskImage: `url(${btnFrame})`, maskImage: `url(${btnFrame})`, WebkitMaskSize: "100% 100%", padding: "18px 48px" }}
                    >
                      {enrolledEventIds.includes(selectedEvent.id) ? "Отменить регистрацию" : "зарегистрироваться"}
                    </button>

                    <div onClick={() => setSelectedEvent(null)} className="text-customyellow text-[46px] mt-[40px] cursor-pointer">▲</div>
                  </div>
                </div>
              </div>
            )}

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
