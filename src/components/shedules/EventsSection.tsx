import React from 'react';
import EventCard from './EventCard';

interface Props {
  events: any[];
  selectedEvent: any | null;
  onSelectEvent: (event: any) => void;
  onRegister: (eventId: string | number) => void;
  enrolledEventIds: Array<string | number>;
}

const EventsSection: React.FC<Props> = ({ events, selectedEvent, onSelectEvent, onRegister, enrolledEventIds }) => {
  return (
    <div className="w-full flex flex-col items-center mt-[80px]">
      {events.map(ev => (
        <EventCard
          key={ev.id}
          event={ev}
          isSelected={selectedEvent?.id === ev.id}
          onSelect={() => onSelectEvent(ev)}
          onRegister={() => onRegister(ev.id)}
          isEnrolled={enrolledEventIds.includes(ev.id)}
        />
      ))}
    </div>
  );
};

export default EventsSection;
