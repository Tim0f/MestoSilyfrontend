import Parkur from "../../assets/svg/parkur.svg";
import BorderUrl from "../../assets/svg/texturedBorder.svg";

export default function SessionCard({ session, isEnrolled, onEnroll }: any) {
  return (
    <div className="relative w-[520px] h-[560px] p-10">
      <img src={BorderUrl} className="absolute inset-0 w-full h-full" />

      <div className={`absolute inset-0 ${isEnrolled ? "bg-customyellow" : "bg-black"}`} />

      <div className="relative z-10 flex h-full">
        <div className="w-1/2 flex items-center justify-center">
          <div
            className="w-[220px] h-[480px]"
            style={{
              WebkitMaskImage: `url(${session.section.iconUrl ?? Parkur})`,
              maskImage: `url(${session.section.iconUrl ?? Parkur})`,
              backgroundColor: isEnrolled ? "#2D282A" : "#F4C884",
              maskRepeat: "no-repeat",
              maskSize: "contain",
              maskPosition: "center",
            }}
          />
        </div>

        <div className="w-1/2 flex flex-col">
          <span className="text-h1 text-customyellow">{session.startsAt}</span>
          <h3 className="text-h2 mt-2">{session.section.name}</h3>
          <p className="text-p mt-2">{session.description}</p>

          <div className="mt-auto">
            {!isEnrolled ? (
              <button onClick={onEnroll} className="bg-customyellow text-black px-6 py-4">
                записаться
              </button>
            ) : (
              <div className="text-customyellow">записан(а)</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
