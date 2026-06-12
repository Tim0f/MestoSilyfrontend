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
  isEnrolled: (string | number)[];
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
      {/* Свёрнутое состояние */}
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
          {/* Полупрозрачное затемнение для читаемости текста */}
          <div className="absolute inset-0 bg-customblack/50" />

          <div className="relative z-10 flex flex-col items-center w-full px-4">
            <h3 className="font-h1 text-customyellow text-2xl md:text-4xl text-center drop-shadow-lg">
              {event.title}
            </h3>
            <p className="font-h1 text-customyellow text-4xl md:text-6xl leading-none mt-2 drop-shadow-lg">
              {event.date}
            </p>
            <ChevronDown size={40} className="text-customyellow mt-2 animate-bounce" />
          </div>
        </div>
      ) : (
        
<div className="relative w-full min-h-[520px] md:min-h-[550px] flex">


<img
  src={event.imageUrl}
  alt={event.title}
  className="absolute inset-0 w-full h-full object-cover"
/>


{/* затемнение */}
<div className="absolute inset-0 bg-customblack/60" />


<div className="relative z-10 w-full flex flex-col px-6 md:px-12 py-8">


  {/* верх */}
  <div className="flex flex-col items-center">

    <h2 className="font-h2 text-customyellow text-3xl md:text-5xl drop-shadow-lg">
      {event.title}
    </h2>


    <p className="font-h1 text-customyellow text-4xl md:text-6xl mt-2 drop-shadow-lg">
      {event.date}
    </p>

  </div>



  {/* центр - смещаем вправо */}
  <div className="flex-1 flex items-center justify-end">

    <div className="w-full md:w-1/2 text-center md:text-left pr-0 md:pr-16">


      <p className="text-customwhite text-base md:text-lg leading-relaxed mb-6">
        {event.fullDescription || event.description}
      </p>


      {event.price && (
        <div className="text-customyellow text-3xl md:text-5xl mb-6">
          Стоимость: {event.price}₽
        </div>
      )}


      <button
        onClick={() => onClick(event.id)}
        className="
          bg-customyellow
          text-customblack
          px-10
          py-3
          text-lg
          font-semibold
          hover:brightness-90
          transition
        "
      >
        {enrolled ? 'Отменить' : 'Записаться'}
      </button>


    </div>

  </div>



  {/* низ */}
  <div className="flex justify-center">

    <button
      onClick={() => setOpened(false)}
      className="animate-bounce"
    >
      <ChevronUp 
        size={42}
        className="text-customyellow"
      />
    </button>

  </div>


</div>

</div>

      )}

      {/* Слайдер (точки) */}
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

        </div>
      )}
    </div>
  );
}