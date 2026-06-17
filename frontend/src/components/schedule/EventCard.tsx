import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ButtonSvg from '../../assets/svg/button.svg?react'

type EventType = {
  id: string | number;
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
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

  // Форматирование даты и времени (без изменений)
  const formatDate = (isoDate: string): string => {
    const d = new Date(isoDate);
    if (isNaN(d.getTime())) return isoDate;
    return d.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = (time: string): string => {
    if (!/^\d{2}:\d{2}$/.test(time)) return time;
    const [hours, minutes] = time.split(':');
    const d = new Date();
    d.setHours(Number(hours), Number(minutes), 0, 0);
    return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  const renderDateTime = () => {
    const dateStr = formatDate(event.date);
    if (event.startTime && event.endTime) {
      return `${dateStr} ${formatTime(event.startTime)} – ${formatTime(event.endTime)}`;
    }
    return dateStr;
  };

  return (
    <div className="relative w-full overflow-hidden rounded-xl">
      {/* Анимируемый контейнер с изменяемой высотой */}
      <motion.div
        className="relative w-full"
        animate={{ height: opened ? 'auto' : '250px' }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        style={{ overflow: 'hidden' }}
      >
        {/* Фоновое изображение и затемнение – общее для всей карточки */}
        <img
          src={event.imageUrl}
          alt={event.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-customblack/50" />

        {/* ===== ВЕРХНЯЯ ЧАСТЬ (всегда видна) ===== */}
        <div
          className="relative z-10 flex flex-col items-center justify-center w-full h-[250px] px-4 cursor-pointer"
          onClick={() => !opened && setOpened(true)}
        >
          <h3 className="font-h1 text-customyellow text-2xl md:text-4xl text-center drop-shadow-lg">
            {event.title}
          </h3>
          <p className="font-h1 text-customyellow text-4xl md:text-6xl leading-none mt-2 drop-shadow-lg">
            {renderDateTime()}
          </p>
          {!opened && (
            <ChevronDown
              size={40}
              className="text-customyellow mt-2 animate-bounce"
            />
          )}
        </div>

        {/* ===== НИЖНЯЯ ЧАСТЬ (выезжает снизу) ===== */}
        <AnimatePresence>
          {opened && (
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="relative z-10 w-full flex flex-col px-6 md:px-12 py-8"
              onClick={(e) => e.stopPropagation()} // чтобы клик по контенту не закрывал
            >
              {/* Основной контент – описание, цена, кнопка (выравнивание справа, как в оригинале) */}
              <div className="flex-1 flex items-center justify-end">
                <div className="w-full md:w-1/2 text-center md:text-left pr-0 md:pr-16">
                  <p className="text-customwhite text-base md:text-lg leading-relaxed mb-6">
                    {event.fullDescription || event.description}
                  </p>
                  {event.price && (
                    <div className="text-customwhite text-3xl md:text-5xl mb-6">
                      Стоимость: {event.price}₽
                    </div>
                  )}
                  <button
  type="button"
  className="relative inline-block"
  onClick={(e) => {
    e.stopPropagation();
    onClick(event.id);
  }}
>
  <ButtonSvg width={233} height={81} className="fill-customyellow z-10" />
  <span className="absolute inset-0 flex items-center justify-center z-20 text-customblack font-p text-p">
    {enrolled ? 'Отменить' : 'Записаться'}
  </span>
</button>
          </div>
              </div>

              {/* Стрелка "свернуть" – по центру внизу */}
              <div className="flex justify-center mt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpened(false);
                  }}
                  className="animate-bounce"
                >
                  <ChevronUp size={42} className="text-customyellow" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Слайдер (точки) – без изменений */}
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