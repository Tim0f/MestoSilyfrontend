// SessionCard.tsx
import { getPublicUrl } from "../../utils/publicUrl";
import Parkur from "../../assets/svg/parkur.svg";

/* ====================== TYPES ====================== */

interface SessionCardProps {
  session: {
    id: string;
    startsAt: string;
    endsAt: string;
    description?: string;
    price?: number;
    section: {
      name: string;
      iconUrl?: string;
    };
    teacher: {
      firstName?: string;
      lastName?: string;
      middleName?: string;
      photoUrl?: string;
    };
  };
  isEnrolled: boolean;
  onEnroll: () => void;
}

/* ====================== COMPONENT ====================== */

export default function SessionCard({
  session,
  isEnrolled,
  onEnroll,
}: SessionCardProps) {
  const duration = getDuration(session.startsAt, session.endsAt);

  const iconUrl = session.section?.iconUrl
    ? getPublicUrl(session.section.iconUrl)
    : Parkur;

  const price = session.price ?? 1100;

  const theme = isEnrolled
    ? {
        bg: "bg-customyellow",
        text: "text-customblack",
        mutedText: "text-customblack/70",
        accent: "text-customblack",
        icon: "#2D282A",
        button: "bg-customblack text-customyellow",
        showBorder: false,
      }
    : {
        bg: "bg-customblack",
        text: "text-customwhite",
        mutedText: "text-customyellow/80",
        accent: "text-customyellow",
        icon: "#F4C884",
        button: "bg-customyellow text-customblack",
        showBorder: true,
      };

  return (
    <div
      className={`relative w-full max-w-[597px] h-auto md:h-[604px] md:w-[597px] overflow-hidden ${
        theme.bg
      } ${!isEnrolled ? "textured-border" : ""}`}
    >
      {/* Фон (скрыт на мобильных, т.к. используется фон родителя) */}
      <div className={`hidden md:block absolute inset-0 ${theme.bg}`} />

      <div className="relative z-10 flex flex-col md:flex-row h-full w-full">
        {/* Левая часть — иконка */}
        <div className="w-full md:w-1/2 flex items-center justify-center py-6 md:py-0">
          <div
            className="w-[150px] h-[300px] md:w-[220px] md:h-[480px]"
            style={{
              WebkitMaskImage: `url(${iconUrl})`,
              maskImage: `url(${iconUrl})`,
              backgroundColor: theme.icon,
              maskRepeat: "no-repeat",
              maskSize: "contain",
              maskPosition: "center",
            }}
          />
        </div>

        {/* Правая часть — контент */}
        <div className="w-full md:w-1/2 flex flex-col px-6 md:pr-6 pb-6 md:pb-0">
          {/* Время */}
          <span className={`text-2xl md:text-h1 font-h1 ${theme.accent}`}>
            {session.startsAt}
          </span>

          {/* Длительность */}
          <span className={`text-sm md:text-p font-p mt-1 ${theme.mutedText}`}>
            длительность {duration}
          </span>

          {/* Название секции */}
          <h3 className={`text-xl md:text-h2 font-h2 mt-2 md:mt-3 ${theme.text}`}>
            {session.section.name}
          </h3>

          {/* Описание */}
          {session.description && (
            <p
              className={`text-sm md:text-p font-p mt-2 line-clamp-4 ${theme.text}`}
            >
              {session.description}
            </p>
          )}

          {/* Учитель */}
          {session.teacher && (
            <div className={`mt-4 flex items-center gap-3 ${theme.text}`}>
              {session.teacher.photoUrl && (
                <img
                  src={getPublicUrl(session.teacher.photoUrl)}
                  alt={`${session.teacher.lastName ?? ""} ${session.teacher.firstName ?? ""}`}
                  className="w-[32px] h-[32px] rounded-full object-cover"
                />
              )}

              <div className="text-sm md:text-p font-p leading-tight">
                {[session.teacher.lastName, session.teacher.firstName, session.teacher.middleName]
                  .filter(Boolean)
                  .join(" ")}
              </div>
            </div>
          )}

          {/* Цена */}
          <div className={`mt-3 md:mt-4 text-xl md:text-h2 font-h2 ${theme.text}`}>
            {price} ₽
          </div>

          {/* Кнопка / статус */}
          <div
            className={`mt-auto pt-4 md:p-[10px] ${
              !isEnrolled ? "md:mb-[40px]" : ""
            }`}
          >
            {!isEnrolled ? (
              <button
                onClick={onEnroll}
                className={`${theme.button} w-full md:w-auto px-6 py-4 text-p font-p`}
              >
                записаться
              </button>
            ) : (
              <div className="px-6 py-6 bg-customblack text-customyellow text-center w-full md:w-[213px] h-auto md:h-[73px] text-p font-p">
                записан(а)
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ====================== HELPERS ====================== */

function getDuration(startsAt: string, endsAt: string) {
  const [sh, sm] = startsAt.split(":").map(Number);
  const [eh, em] = endsAt.split(":").map(Number);

  const diff = eh * 60 + em - (sh * 60 + sm);

  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;

  if (hours && minutes) return `${hours} часа ${minutes} минут`;
  if (hours) return `${hours} часа`;
  return `${minutes} минут`;
}