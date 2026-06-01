// SessionsGrid.tsx
import SessionCard from "./SessionCard";

export default function SessionsGrid({ sessions, enrolledSessions, onEnroll }: any) {
  if (!sessions.length)
    return <div className="text-center mt-10 md:mt-20 text-customyellow">Нет занятий</div>;

  return (
    <div className="flex justify-center mt-10 md:mt-20 flex flex-wrap gap-6 md:gap-10 justify-center">
      {sessions.map((s: any) => (
        <SessionCard
          key={s.id}
          session={s}
          isEnrolled={enrolledSessions.includes(s.id)}
          onEnroll={() => onEnroll(s)}
        />
      ))}
    </div>
  );
}