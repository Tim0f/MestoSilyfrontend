// src/components/shedule/WeekSwitcher.tsx
import Border2 from "../border2";

interface Props {
  weekDates: Date[];
  selectedDate: Date;
  onSelect: (d: Date) => void;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  formatDate: (d: Date) => string;
}

export default function WeekSwitcher({
  weekDates,
  selectedDate,
  onSelect,
  onPrevWeek,
  onNextWeek,
  formatDate,
}: Props) {
  return (
    <div className="flex items-center gap-[28px] mt-6">
      <div className="flex gap-[18px]">
        {weekDates.map((date, i) => {
          const isActive = date.toDateString() === selectedDate.toDateString();
          const dayName = date.toLocaleDateString("ru-RU", { weekday: "short" });

          return (
            <button
              key={i}
              onClick={() => onSelect(date)}
              className="w-[95px] h-[85px]"
            >
              <Border2
                className={`${isActive ? "fill-customblack" : "fill-customyellow"} stroke-customyellow`}
              >
                <span className="text-[26px] font-h1 text-black">
                  {date.getDate()}
                </span>
                <span className="text-[15px] uppercase">{dayName}</span>
              </Border2>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-[16px] text-[#F4C884]">
        <button onClick={onPrevWeek} className="text-[30px]">&lt;</button>
        <span className="text-[20px]">
          {formatDate(weekDates[0])} – {formatDate(weekDates[6])}
        </span>
        <button onClick={onNextWeek} className="text-[30px]">&gt;</button>
      </div>
    </div>
  );
}
