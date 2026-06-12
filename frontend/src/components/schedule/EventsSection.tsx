import EventCard from "./EventCard";

export default function EventsSection({ events, enrolledEventIds, onRegister }: any) {
  if (!events.length) return null;

  return (
    <div className="flex justify-center mt-[60px] md:mt-[120px]">
      <EventCard
        events={events}
        isEnrolled={enrolledEventIds}
        onClick={onRegister}
      />
    </div>
  );
}