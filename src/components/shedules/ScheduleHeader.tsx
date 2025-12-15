import React from 'react';
import Border2 from '../../assets/svg/weeknumb.svg';
import Border3 from '../../assets/svg/numb.svg';

interface Props {
  weekDates: Date[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  subscriptionCount: number;
  onOpenFreeVisits: () => void;
  onPrevWeek: () => void;
  onNextWeek: () => void;
}

const ScheduleHeader: React.FC<Props> = ({
  weekDates,
  selectedDate,
  onSelectDate,
  subscriptionCount,
  onOpenFreeVisits,
  onPrevWeek,
  onNextWeek,
}) => {
  return (
    <div className="flex items-center gap-[40px] mt-6">
      {/* Бесплатные посещения */}
      <div className="flex items-center gap-[20px]">
        <span className="text-[24px] text-white">Кол-во бесплатных посещений:</span>
        <button onClick={onOpenFreeVisits} className="w-[95px] h-[85px] flex justify-center items-center">
          <Border3 className="w-full h-full fill-customyellow stroke-customyellow flex justify-center items-center hover:scale-[1.03] transition">
            <span className="text-[28px] font-h1 text-black leading-none">{subscriptionCount}</span>
          </Border3>
        </button>
      </div>

      {/* Даты недели */}
      <div className="flex items-center gap-[28px]">
        <div className="flex gap-[18px]">
          {weekDates.map((date, i) => {
            const isActive = date.toDateString() === selectedDate.toDateString();
            const dayName = date.toLocaleDateString("ru-RU", { weekday: "short" });
            return (
              <button key={i} onClick={() => onSelectDate(date)} className="w-[95px] h-[85px] flex flex-col justify-center items-center">
                <Border2 className={`${isActive ? "fill-customblack" : "fill-customyellow"} stroke-customyellow`}>
                  <span className="text-[26px] font-h1 text-black leading-none">{date.getDate()}</span>
                  <span className="text-[15px] mt-[3px] uppercase">{dayName}</span>
                </Border2>
              </button>
            );
          })}
        </div>

        {/* Навигация по неделям */}
        <div className="flex items-center gap-[16px] text-[#F4C884]">
          <button onClick={onPrevWeek} className="text-[30px]">&lt;</button>
          <span className="text-[20px]">
            {weekDates[0].toLocaleDateString("ru-RU", { day: 'numeric', month: 'numeric' })} - {weekDates[6].toLocaleDateString("ru-RU", { day: 'numeric', month: 'numeric' })}
          </span>
          <button onClick={onNextWeek} className="text-[30px]">&gt;</button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleHeader;
