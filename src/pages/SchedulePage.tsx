// src/pages/SchedulePage.tsx
import { useEffect, useState } from "react";
import { Client } from "../services/httpClient";
import { useAuth } from "../context/AuthContext";
import { freeVisitsService } from "../services/FreeVisitsFrontendService";
import { EnrollmentsFrontendService } from "../services/enrollments.service";
import { EventsFrontendService } from "../services/events.service";

import ScheduleHeader from "../components/shedules/ScheduleHeader";
import SessionsGrid from "../components/shedules/SessionsGrid";
import EventsSection from "../components/shedules/EventsSection";
import FreeVisitsModal from "../components/shedules/FreeVisitsModal";

import Parkur from "../assets/svg/parkur.svg";

// сервисы
const enrollmentsService = new EnrollmentsFrontendService(Client);
const eventsService = new EventsFrontendService(Client);

interface Session { /* ... тип Session как в оригинале ... */ }
interface Event { /* ... тип Event как в оригинале ... */ }
interface BackendEnrollmentRecord { /* ... */ }

const toISODateString = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
};

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
  const [isFreeVisitsModalOpen, setIsFreeVisitsModalOpen] = useState(false);

  const { isAuthenticated } = useAuth();

  // --- вычисляем даты текущей недели
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

  // --- загрузка моих записей
  const loadMyEnrollments = async (): Promise<void> => {
    try {
      const arr = await enrollmentsService.getMyEnrollments<BackendEnrollmentRecord[]>();
      const lessonIds = arr.filter(r => r.lessonId != null).map(r => r.lessonId as string | number);
      const sectionOnlyIds = arr.filter(r => !r.lessonId && r.sectionId).map(r => r.sectionId as string | number);
      const eventIds = arr.filter(r => r.eventId != null).map(r => r.eventId as string | number);
      setEnrolledSessions([...lessonIds, ...sectionOnlyIds]);
      setEnrolledEventIds(eventIds);
    } catch {
      setEnrolledSessions([]);
      setEnrolledEventIds([]);
    }
  };

  // --- загрузка данных
  useEffect(() => {
    let mounted = true;

    async function loadData() {
      const dateISO = toISODateString(selectedDate);
      setLoadingSessions(true);
      setErrorSessions(null);

      try {
        const payloadSessions: any[] = await Client.get("/lessons/by-date", { query: { date: dateISO }, authenticate: true });
        if (mounted) setSessions(payloadSessions ?? []);
      } catch (e: any) {
        if (mounted) {
          setErrorSessions("Ошибка при загрузке занятий");
          setSessions([]);
        }
      } finally {
        if (mounted) setLoadingSessions(false);
      }

      try {
        const payloadEvents: any[] = await Client.get("/events", { authenticate: true });
        if (mounted) {
          setEvents(payloadEvents ?? []);
          if (!selectedEvent && payloadEvents?.length > 0) setSelectedEvent(payloadEvents[0]);
        }
      } catch {}

      if (isAuthenticated) {
        await loadMyEnrollments();
        const uid = localStorage.getItem("userId");
        if (uid) {
          try {
            const visits = await freeVisitsService.getUserFreeVisits(uid);
            if (mounted) setSubscriptionCount(visits?.available ?? 0);
          } catch {
            if (mounted) setSubscriptionCount(0);
          }
        }
      } else {
        setEnrolledSessions([]);
        setEnrolledEventIds([]);
        setSubscriptionCount(0);
      }
    }

    loadData();
    return () => { mounted = false; };
  }, [selectedDate, isAuthenticated]);

  // ====== запись на урок ======
  const enrollToLesson = async (session: Session) => {
    if (!isAuthenticated) return alert("Пожалуйста, войдите в систему");
    if (enrolledSessions.includes(session.id)) return alert("Вы уже записаны");

    try {
      await enrollmentsService.enroll({ sectionId: session.section.id, lessonId: session.id });
      setEnrolledSessions(prev => [...prev, session.id]);
      await loadMyEnrollments();
      alert("Вы успешно записаны на занятие");
    } catch (err: any) {
      alert(err?.message ?? "Ошибка записи");
    }
  };

  // ====== регистрация на событие ======
  const registerForEvent = async (eventId: string | number) => {
    if (!isAuthenticated) return alert("Пожалуйста, войдите в систему");
    try {
      if (enrolledEventIds.includes(eventId)) {
        await eventsService.cancelRegistration(String(eventId));
        setEnrolledEventIds(prev => prev.filter(id => id !== eventId));
        alert("Вы отменили регистрацию");
        return;
      }
      await eventsService.registerForEvent(String(eventId));
      setEnrolledEventIds(prev => [...prev, eventId]);
      alert("Успешно зарегистрированы на событие");
    } catch (err: any) {
      alert(err?.message ?? "Ошибка регистрации");
    }
  };

  const filteredSessions = sessions.filter(s => (s.date ?? "").slice(0,10) === toISODateString(selectedDate));

  return (
    <div className="w-full min-h-screen bg-customblack text-white font-['Unbounded'] flex flex-col items-center pb-[200px]">
      <h1 className="mt-[120px] text-[96px] font-h1 text-customyellow text-center">РАСПИСАНИЕ</h1>

      <ScheduleHeader
        weekDates={weekDates}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        subscriptionCount={subscriptionCount}
        onOpenFreeVisits={() => setIsFreeVisitsModalOpen(true)}
        onPrevWeek={() => { const d = new Date(selectedDate); d.setDate(d.getDate() - 7); setSelectedDate(d); }}
        onNextWeek={() => { const d = new Date(selectedDate); d.setDate(d.getDate() + 7); setSelectedDate(d); }}
      />

      {errorSessions && <div className="text-red-400 mt-[30px] text-center">{errorSessions}</div>}
      {!loadingSessions && filteredSessions.length === 0 && !errorSessions && (
        <div className="text-center text-[32px] text-customyellow mt-[60px]">На этот день занятий нет</div>
      )}

      <SessionsGrid sessions={filteredSessions} enrolledSessions={enrolledSessions} onEnroll={enrollToLesson} />

      {events.length > 0 && (
        <EventsSection
          events={events}
          selectedEvent={selectedEvent}
          onSelectEvent={setSelectedEvent}
          onRegister={registerForEvent}
          enrolledEventIds={enrolledEventIds}
        />
      )}

      <FreeVisitsModal open={isFreeVisitsModalOpen} onClose={() => setIsFreeVisitsModalOpen(false)} />
    </div>
  );
}
