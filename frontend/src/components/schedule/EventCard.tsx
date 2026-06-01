// EventCard.tsx
export default function EventCard({ event, isEnrolled, onClick }: any) {
  return (
    <div
      className="relative h-[250px] md:h-[300px] bg-cover bg-center mb-6 md:mb-10"
      style={{ backgroundImage: `url(${event.imageUrl})` }}
    >
      <div className="absolute inset-0 bg-customblack/50" />

      <div className="relative z-10 p-6 md:p-10">
        <h3 className="text-2xl md:text-4xl text-customyellow">{event.title}</h3>
        <p className="mt-2 md:mt-4 text-sm md:text-base">{event.description}</p>

        <button onClick={onClick} className="mt-6 bg-customyellow text-customblack px-6 py-3"/>
        <button onClick={onClick} className="mt-4 md:mt-6 bg-customyellow text-customblack px-4 py-2 md:px-6 md:py-3 text-sm md:text-base">
          {isEnrolled ? "Отменить" : "Записаться"}
        </button>
      </div>
    </div>
  );
}