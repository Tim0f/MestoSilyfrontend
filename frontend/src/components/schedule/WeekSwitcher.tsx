import Border2 from "../border2";
import Border3 from "../border3";

/* ================= PROPS ================= */
interface Props {
  weekDates: Date[];
  selectedDate: Date;
  onSelect: (d: Date) => void;
  subscriptionCount: number;
  onOpenFreeVisits: () => void;
  onPrevWeek: () => void;
  onNextWeek: () => void;
}

/* ================= UTILS ================= */
const formatDate = (d: Date) =>
  d.toLocaleDateString("ru-RU", { day: "numeric", month: "numeric" });

const formatFullDate = (d: Date) =>
  d.toLocaleDateString("ru-RU", { day: "numeric", month: "long" });

/* ================= COMPONENT ================= */
export default function WeekSwitcher({
  weekDates,
  selectedDate,
  onSelect,
  subscriptionCount,
  onOpenFreeVisits,
  onPrevWeek,
  onNextWeek,
}: Props) {
  if (!weekDates?.length) return null;

  // Переключение на предыдущий / следующий день (только для мобильной версии)
  const goPrevDay = () => {
    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 1);
    onSelect(prev);
  };

  const goNextDay = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    onSelect(next);
  };

  return (
    <div className="flex justify-center flex-col md:flex-row items-center gap-[20px] md:gap-[40px] mt-4 md:mt-6 w-full">
      {/* ===== БЕСПЛАТНЫЕ ПОСЕЩЕНИЯ (общий блок) ===== */}
      <div className="flex items-center gap-[10px] md:gap-[20px]">
        <span className="text-p font-p text-customwhite w-auto md:w-[243px]">
          Кол-во бесплатных посещений:
        </span>

        <button
          onClick={onOpenFreeVisits}
          className="w-[75px] h-[65px] md:w-[95px] md:h-[85px] flex justify-center items-center"
        >
          <Border3 className="w-full h-full fill-customyellow stroke-customyellow flex justify-center items-center hover:scale-[1.03] transition">
            <span className="text-[22px] md:text-[28px] font-h1 text-customblack leading-none">
              {subscriptionCount}
            </span>
          </Border3>
        </button>
      </div>

      {/* ===== ДЕСКТОПНАЯ ВЕРСИЯ (7 дней + навигация по неделям) ===== */}
      <div className="hidden md:flex items-center gap-[16px] md:gap-[28px] flex-wrap">
        <div className="flex gap-[8px] md:gap-[18px] flex-wrap">
          {weekDates.map((date, i) => {
            const isActive =
              date.toDateString() === selectedDate.toDateString();
            const dayName = date.toLocaleDateString("ru-RU", {
              weekday: "short",
            });

            return (
              <button
                key={i}
                onClick={() => onSelect(date)}
                className="w-[95px] h-[85px] flex flex-col justify-center items-center"
              >
                <Border2
                  className={`${
                    isActive
                      ? "fill-customblack text-customwhite"
                      : "fill-customyellow text-customblack"
                  } stroke-customyellow`}
                >
                  <span className="text-[26px] font-h1 text-customblack leading-none">
                    {date.getDate()}
                  </span>
                  <span className="text-[15px] mt-[3px] uppercase">
                    {dayName}
                  </span>
                </Border2>
              </button>
            );
          })}
        </div>

        {/* Навигация по неделям (десктоп) */}
        <div className="flex items-center gap-[8px] md:gap-[16px] text-customyellow flex-wrap">
          <button onClick={onPrevWeek} className="text-[24px] md:text-[30px]">
            &lt;
          </button>
          <span className="text-[16px] md:text-[20px]">
            {formatDate(weekDates[0])} – {formatDate(weekDates[6])}
          </span>
          <button onClick={onNextWeek} className="text-[24px] md:text-[30px]">
            &gt;
          </button>
        </div>
      </div>

      {/* ===== МОБИЛЬНАЯ ВЕРСИЯ (только стрелки + текстовая дата, по центру) ===== */}
      <div className="flex md:hidden items-center justify-center gap-4 text-customyellow w-full">
        <button onClick={goPrevDay} className="text-[24px]">
          &lt;
        </button>
        <span className="text-[16px] font-medium">
          {formatFullDate(selectedDate)}
        </span>
        <button onClick={goNextDay} className="text-[24px]">
          &gt;
        </button>
      </div>
    </div>
  );
}