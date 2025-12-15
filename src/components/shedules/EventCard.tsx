// src/components/schedules/EventCard.tsx
import React from "react";
import btnFrame from "../../assets/svg/Rectangle_9.svg";

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

interface Props {
  event: Event;
  isSelected: boolean;
  onSelect: () => void;
  onRegister: () => void;
  isEnrolled: boolean;
}

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
  return val?.slice(0, 5) ?? "—";
};

const EventCard: React.FC<Props> = ({ event, isSelected, onSelect, onRegister, isEnrolled }) => {
  const eventDate = event.date ? new Date(event.date) : null;

  return (
    <div
      className={`w-full relative flex flex-col items-center mb-8 cursor-pointer ${
        isSelected ? "z-10" : "z-0"
      }`}
      onClick={onSelect}
      style={{
        backgroundImage: `url(${event.imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/40" />

      <div className="w-full max-w-[1400px] flex flex-col items-center relative z-10 p-8 text-center text-white">
        <h2 className="text-[42px] font-['Zero_Cool'] text-customyellow">{event.title}</h2>
        <p className="text-[62px] font-h1 text-customyellow mt-[10px]">
          {eventDate ? formatDate(eventDate) : "—"} {formatTime(event.startTime)}–{formatTime(event.endTime)}
        </p>

        <div className="mt-[20px] text-left max-w-[900px]">
          <p className="text-[20px] leading-[28px] whitespace-pre-line">{event.description}</p>
          <p className="text-[32px] font-bold text-customyellow mt-[20px]">
            Стоимость: {event.price ? `${event.price} руб` : "Бесплатно"}
          </p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onRegister();
          }}
          className="bg-customyellow relative text-black text-[20px] font-bold w-fit h-fit flex items-center justify-center mt-6"
          style={{
            WebkitMaskImage: `url(${btnFrame})`,
            maskImage: `url(${btnFrame})`,
            WebkitMaskSize: "100% 100%",
            padding: "18px 48px",
          }}
        >
          {isEnrolled ? "Отменить регистрацию" : "зарегистрироваться"}
        </button>
      </div>
    </div>
  );
};

export default EventCard;
