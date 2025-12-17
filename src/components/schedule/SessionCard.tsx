import Parkur from "../../assets/svg/parkur.svg";
// import BorderUrl from "../../assets/svg/texturedBorder.svg";

const PRICE = 1100;

export default function SessionCard({
  session,
  isEnrolled,
  onEnroll,
}: {
  session: any;
  isEnrolled: boolean;
  onEnroll: () => void;
}) {
  const duration = getDuration(session.startsAt, session.endsAt);

  const theme = isEnrolled
    ? {
        bg: "bg-customyellow",
        text: "text-black",
        mutedText: "text-black/70",
        accent: "text-black",
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
        button: "bg-customyellow text-black",
        showBorder: true,
      };

  return (
    <div
  className={`relative h-[604px] w-[597px] overflow-hidden ${
    !isEnrolled ? "textured-border" : ""
  }`}
>

      {/* Фон карточки */}
      <div className={`absolute inset-0 ${theme.bg}`} />

      {/* Рамка — ТОЛЬКО если не записан */}
      {/* {theme.showBorder && (
        <img
          src={BorderUrl}
          className="absolute inset-0 h-[604px] w-[597px] pointer-events-none"
          alt=""
        />
      )} */}

      <div className="relative z-10 flex h-[604px] w-[597px]">
        {/* Левая часть — иконка */}
        <div className="w-1/2 flex items-center justify-center">
          <div
            className="w-[220px] h-[480px]"
            style={{
              WebkitMaskImage: `url(${session.section.iconUrl ?? Parkur})`,
              maskImage: `url(${session.section.iconUrl ?? Parkur})`,
              backgroundColor: theme.icon,
              maskRepeat: "no-repeat",
              maskSize: "contain",
              maskPosition: "center",
            }}
          />
        </div>

        {/* Правая часть — контент */}
        <div className="w-1/2 flex flex-col">
          {/* Время */}
          <span className={`text-h1 font-h1 ${theme.accent}`}>
            {session.startsAt}
          </span>

          {/* Длительность */}
          <span className={`text-p font-p mt-1 ${theme.mutedText}`}>
            длительность {duration}
          </span>

          {/* Название секции */}
          <h3 className={`text-h2 font-h2 mt-3 ${theme.text}`}>
            {session.section.name}
          </h3>

          {/* Описание */}
          <p className={`text-p font-p mt-2 line-clamp-4 ${theme.text}`}>
            {session.description}
          </p>

          {/* Учитель */}
         {/* Учитель */}
<div className={`mt-4 flex items-center gap-3 ${theme.text}`}>
  {/* Аватар */}
  <img
    src={session.teacher.photoUrl}
    alt={`${session.teacher.lastName} ${session.teacher.firstName}`}
    className="w-[32px] h-[32px] rounded-full object-cover"
  />

  {/* ФИО */}
  <div className="text-p font-p leading-tight">
    {session.teacher.lastName}{" "}
    {session.teacher.firstName}{" "}
    {session.teacher.middleName}
  </div>
</div>


          {/* Цена */}
          <div className={`mt-2 text-h2 font-h2 ${theme.text}`}>
            {PRICE}руб
          </div>

          {/* Кнопка / статус */}
          <div
  className={`mt-auto p-[10px] ${
    !isEnrolled ? "mb-[40px]" : ""
  }`}
>

            {!isEnrolled ? (
              <button
                onClick={onEnroll}
                className={`${theme.button} px-6 py-4 text-p font-p`}
              >
                записаться
              </button>
            ) : (
              <div className="px-6 py-6 bg-customblack text-customyellow text-center w-[213px] h-[73px] text-p font-p">
                записан(а)
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= helpers ================= */

function getDuration(startsAt: string, endsAt: string) {
  const [sh, sm] = startsAt.split(":").map(Number);
  const [eh, em] = endsAt.split(":").map(Number);

  const start = sh * 60 + sm;
  const end = eh * 60 + em;
  const diff = end - start;

  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;

  if (hours && minutes) return `${hours} часа ${minutes} минут`;
  if (hours) return `${hours} часа`;
  return `${minutes} минут`;
}
