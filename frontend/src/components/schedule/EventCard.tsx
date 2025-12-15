export default function EventCard({ event, isEnrolled, onClick }: any) {
  return (
    <div
      className="relative h-[300px] bg-cover bg-center mb-10"
      style={{ backgroundImage: `url(${event.imageUrl})` }}
    >
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 p-10">
        <h3 className="text-4xl text-customyellow">{event.title}</h3>
        <p className="mt-4">{event.description}</p>

        <button onClick={onClick} className="mt-6 bg-customyellow text-black px-6 py-3">
          {isEnrolled ? "Отменить" : "Записаться"}
        </button>
      </div>
    </div>
  );
}
