import { useEffect, useState } from "react";

import { Client } from "../services/httpClient";
import { useAuth } from "../context/AuthContext";
import { freeVisitsService } from "../services/FreeVisitsFrontendService";
import { EnrollmentsFrontendService } from "../services/enrollments.service";
import { EventsFrontendService } from "../services/events.service";

import ScheduleHeader from "../components/schedule/ScheduleHeader";
import WeekSwitcher from "../components/schedule/WeekSwitcher";
import SessionsGrid from "../components/schedule/SessionsGrid";
import EventsSection from "../components/schedule/EventsSection";
import FreeVisitsModal from "../components/schedule/FreeVisitsModal";

import Parkur from "../assets/svg/parkur.svg";
import EventFallback from "../assets/img/Mask_group.png";

/* ====================== SERVICES ====================== */

const enrollmentsService = new EnrollmentsFrontendService(Client);
const eventsService = new EventsFrontendService(Client);

/* ====================== TYPES ====================== */

export interface Session {
  id: string;
  date: string;
  startsAt: string;
  endsAt: string;
  description: string;
  price: number;
  enrollments: any[];
  section: {
    id: string;
    name: string;
    iconUrl?: string;
  };
  teacher: {
    firstName?: string;
    lastName?: string;
    middleName?: string;
    photoUrl?: string;
  };
}

export interface Event {
  id: string | number;
  title: string;
  description?: string;
  imageUrl?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  price?: number;
}

/* ====================== HELPERS ====================== */

const toISO = (d: Date) => d.toISOString().slice(0, 10);

/* ====================== PAGE ====================== */

export default function SchedulePage() {
  const { isAuthenticated, user } = useAuth();

  const [sessions, setSessions] = useState<Session[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [enrolledSessions, setEnrolledSessions] = useState<(string | number)[]>([]);
  const [enrolledEventIds, setEnrolledEventIds] = useState<(string | number)[]>([]);

  const [subscriptionCount, setSubscriptionCount] = useState(0);
  const [isFreeVisitsModalOpen, setIsFreeVisitsModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ====================== LOADERS ====================== */

  const loadSessions = async () => {
    setLoading(true);
    setError(null);

    try {
      const payload = await Client.get<any[]>("/lessons/by-date", {
        query: { date: toISO(selectedDate) },
        authenticate: true,
      });

      setSessions(
        payload.map((l) => ({
          id: l.id,
          date: l.date,
          startsAt: l.startsAt,
          endsAt: l.endsAt,
          description: l.description ?? "",
          price: l.price ?? 1100,
          enrollments: l.enrollments ?? [],
          section: {
            id: l.section?.id,
            name: l.section?.name ?? "Без названия",
            iconUrl: l.section?.iconUrl ?? Parkur,
          },
          teacher: {
            firstName: l.teacher?.firstName,
            lastName: l.teacher?.lastName,
            middleName: l.teacher?.middleName,
            photoUrl: l.teacher?.photoUrl,
          },
        }))
      );
    } catch {
      setError("Ошибка загрузки занятий");
    } finally {
      setLoading(false);
    }
  };

  const loadEvents = async () => {
    const payload = await Client.get<any[]>("/events", { authenticate: true });

    setEvents(
      payload.map((e) => ({
        id: e.id,
        title: e.title,
        description: e.description,
        imageUrl: e.imageUrl ?? EventFallback,
        date: e.date,
        startTime: e.startTime,
        endTime: e.endTime,
        price: e.price,
      }))
    );
  };

  const loadMyEnrollments = async () => {
    if (!isAuthenticated) return;

    const arr = await enrollmentsService.getMyEnrollments<any[]>();

    setEnrolledSessions(arr.filter((r) => r.lessonId).map((r) => r.lessonId));
    setEnrolledEventIds(arr.filter((r) => r.eventId).map((r) => r.eventId));
  };

  const loadFreeVisits = async () => {
    if (!isAuthenticated || !user?.id) return;

    const res = await freeVisitsService.getUserFreeVisits(String(user.id));
    setSubscriptionCount(res.available ?? 0);
  };

  /* ====================== EFFECT ====================== */

  useEffect(() => {
    loadSessions();
    loadEvents();
    loadMyEnrollments();
    loadFreeVisits();
  }, [selectedDate, isAuthenticated]);

  /* ====================== ACTIONS ====================== */

  const enrollToLesson = async (session: Session) => {
    if (!isAuthenticated) return alert("Войдите в систему");

    await enrollmentsService.enroll({
      sectionId: session.section.id,
      lessonId: session.id,
    });

    await loadMyEnrollments();
    await loadFreeVisits();
  };

  const registerForEvent = async (id: string | number) => {
    if (!isAuthenticated) return alert("Войдите в систему");

    if (enrolledEventIds.includes(id)) {
      await eventsService.cancelRegistration(String(id));
    } else {
      await eventsService.registerForEvent(String(id));
    }

    await loadMyEnrollments();
  };

  /* ====================== WEEK ====================== */

  const weekDates = (() => {
    const start = new Date(selectedDate);
    start.setDate(start.getDate() - ((start.getDay() + 6) % 7));

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  })();

  const filteredSessions = sessions.filter(
    (s) => s.date?.slice(0, 10) === toISO(selectedDate)
  );

  /* ====================== RENDER ====================== */

  return (
    <div className="min-h-screen bg-customblack text-customwhite pb-[200px]">
      <ScheduleHeader />

<div className="flex justify-center w-full">
  <WeekSwitcher
    weekDates={weekDates}
    selectedDate={selectedDate}
    onSelect={setSelectedDate}
    subscriptionCount={subscriptionCount}
    onOpenFreeVisits={() => setIsFreeVisitsModalOpen(true)}
    onPrevWeek={() => {
      const d = new Date(selectedDate);
      d.setDate(d.getDate() - 7);
      setSelectedDate(d);
    }}
    onNextWeek={() => {
      const d = new Date(selectedDate);
      d.setDate(d.getDate() + 7);
      setSelectedDate(d);
    }}
  />
</div>

      {loading && <div className="text-center mt-20">Загрузка…</div>}
      {error && <div className="text-center text-red-400 mt-20">{error}</div>}

      <SessionsGrid
        sessions={filteredSessions}
        enrolledSessions={enrolledSessions}
        onEnroll={enrollToLesson}
      />

      <EventsSection
        events={events}
        enrolledEventIds={enrolledEventIds}
        onRegister={registerForEvent}
      />

      {isFreeVisitsModalOpen && (
        <FreeVisitsModal onClose={() => setIsFreeVisitsModalOpen(false)} />
      )}
    </div>
  );
}
