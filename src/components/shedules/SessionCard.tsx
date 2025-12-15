// src/components/schedules/SessionCard.tsx
import React from "react";
import BorderUrl from "../../assets/svg/texturedBorder.svg";
import Parkur from "../../assets/svg/parkur.svg";

interface SessionCardProps {
  session: any;
  isEnrolled: boolean;
  onEnroll: (session: any) => void;
}

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

function calcDuration(start?: string, end?: string): number {
  if (!start || !end) return 0;
  const [h1 = 0, m1 = 0] = start.split(":").map(Number);
  const [h2 = 0, m2 = 0] = end.split(":").map(Number);
  const t1 = h1 * 60 + m1;
  const t2 = h2 * 60 + m2;
  return Math.max(1, Math.round((t2 - t1) / 60));
}

const SessionCard: React.FC<SessionCardProps> = ({ session, isEnrolled, onEnroll }) => {
  return (
    <div className={`relative w-[520px] h-[560px] p-[40px] ${isEnrolled ? "text-black" : "text-white"}`}>
      <img src={BorderUrl} alt="" className="absolute inset-0 w-full h-full z-20 pointer-events-none" />
      <div className={`absolute inset-0 ${isEnrolled ? "bg-customyellow" : "bg-customblack"}`} />

      <div className="relative z-10 flex w-full h-full">
        <div className="w-1/2 flex items-center justify-center">
          <div
            className="w-[220px] h-[480px] select-none"
            style={{
              WebkitMaskImage: `url(${session.section.iconUrl ?? Parkur})`,
              maskImage: `url(${session.section.iconUrl ?? Parkur})`,
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
              backgroundColor: isEnrolled ? "#2D282A" : "#F4C884",
            }}
          />
        </div>

        <div className="w-1/2 flex flex-col">
          <div>
            <span className={`text-h1 font-h1 leading-[80px] ${isEnrolled ? "text-customblack" : "text-customyellow"}`}>
              {formatTime(session.startsAt)}
            </span>
            <div className={`text-p font-p -mt-2 ${isEnrolled ? "text-black" : "text-customyellow"}`}>
              длительность: {calcDuration(session.startsAt, session.endsAt)} часа
            </div>
          </div>

          <h3 className={`text-h2 font-h2 mt-[10px] ${isEnrolled ? "text-customblack" : "text-customwhite"}`}>
            {session.section.name}
          </h3>

          <p className={`text-p font-p mt-[10px] max-w-[280px] leading-[20px] ${isEnrolled ? "text-customblack" : "text-customwhite"}`}>
            {session.description}
          </p>

          <div className="mt-[20px] flex items-center gap-[12px]">
            {session.teacher.photoUrl ? (
              <img src={session.teacher.photoUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#F4C884]" />
            )}
            <div className={`text-p font-p ${isEnrolled ? "text-customblack" : "text-customwhite"}`}>
              {session.teacher.lastName} {session.teacher.firstName} {session.teacher.middleName}
            </div>
          </div>

          <div className={`text-h2 font-h2 mt-[20px] ${isEnrolled ? "text-customblack" : "text-customwhite"}`}>
            {session.price} руб
          </div>

          <div className="pt-[10px]">
            {!isEnrolled ? (
              <button
                onClick={() => onEnroll(session)}
                className="w-[213px] h-[73px] bg-customyellow mx-auto rounded-[5px] text-p text-customblack font-p hover:bg-[#F4C884]/80 transition"
              >
                записаться
              </button>
            ) : (
              <div className="w-[213px] h-[73px] bg-customblack mx-auto rounded-[5px] flex items-center justify-center">
                <span className="text-p font-p text-customyellow">записан(а)</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionCard;
