// EventsSection.tsx
import EventCard from "./EventCard";

export default function EventsSection({ events, enrolledEventIds, onRegister }: any) {
  if (!events.length) return null;

  return (
    <div className="mt-[60px] md:mt-[120px]">
      {events.map((e: any) => (
        <EventCard
          key={e.id}
          event={e}
          isEnrolled={enrolledEventIds.includes(e.id)}
          onClick={() => onRegister(e.id)}
        />
      ))}
    </div>
  );
}