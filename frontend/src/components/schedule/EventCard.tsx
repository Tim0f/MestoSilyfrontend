import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

type EventType = {
  id: string | number;
  title: string;
  date: string;
  description: string;
  fullDescription?: string;
  price?: number;
  imageUrl: string;
};

type EventCardProps = {
  events: EventType[];
  isEnrolled: (string | number)[]; // массив id, на которые пользователь записан
  onClick: (eventId: string | number) => void;
};

export default function EventCard({ events, isEnrolled, onClick }: EventCardProps) {
  const [opened, setOpened] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(0);

  if (!events || events.length === 0) return null;

  const event = events[currentEvent];
  const enrolled = isEnrolled.includes(event.id);

  return (
    <div className="relative w-full overflow-hidden rounded-xl">
      {/* свёрнутое состояние */}
      {!opened ? (
        <div
          onClick={() => setOpened(true)}
          className="relative w-full h-[250px] md:h-[300px] cursor-pointer flex items-center"
        >
          <img
            src={event.imageUrl}
            alt={event.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-customblack" />
          <div className="relative z-10 flex flex-col items-center w-full px-4">
            <h3 className="font-h2 text-customyellow text-2xl md:text-4xl text-center">
              {event.title}
            </h3>
            <p className="font-h1 text-customyellow text-4xl md:text-6xl leading-none mt-2">
              {event.date}
            </p>
            <ChevronDown size={40} className="text-customyellow mt-2 animate-bounce" />
          </div>
        </div>
      ) : (
        /* раскрытое состояние */
        <div className="w-full min-h-[650px] flex flex-col md:flex-row bg-customblack">
          <div className="w-full md:w-[45%] h-64 md:h-auto">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 p-6 md:p-10 flex flex-col">
            <button onClick={() => setOpened(false)} className="self-end mb-4">
              <ChevronUp size={32} className="text-customyellow" />
            </button>
            <h2 className="text-3xl md:text-4xl font-h2 text-customyellow mb-4">
              {event.title}
            </h2>
            <div className="text-lg text-customyellow/80 mb-4">{event.date}</div>
            <p className="text-customwhite text-base leading-relaxed mb-8">
              {event.fullDescription || event.description}
            </p>
            {event.price && (
              <div className="text-4xl md:text-5xl text-customyellow mb-6">
                Стоимость: {event.price}₽
              </div>
            )}
            <button
              onClick={() => onClick(event.id)}
              className="mt-auto bg-customyellow text-customblack px-8 py-3 text-lg font-semibold hover:brightness-90 transition self-start"
            >
              {enrolled ? 'Отменить' : 'Записаться'}
            </button>
          </div>
        </div>
      )}

      {/* слайдер */}
      {events.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-2 z-20">
          <div className="flex gap-2">
            {events.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setOpened(false);
                  setCurrentEvent(index);
                }}
                className={`w-3 h-3 rounded-full transition ${
                  currentEvent === index
                    ? 'bg-customyellow scale-110'
                    : 'bg-customyellow/30 hover:bg-customyellow/50'
                }`}
              />
            ))}
          </div>
          {!opened && (
            <div className="flex justify-between w-full px-6 absolute bottom-6">
              
            </div>
          )}
        </div>
      )}
    </div>
  );
}