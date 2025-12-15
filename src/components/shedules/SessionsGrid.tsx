// src/components/schedules/SessionsGrid.tsx
import React from "react";
import SessionCard from "./SessionCard";

interface Session {
  id: string;
  startsAt: string;
  endsAt: string;
  price?: number;
  description?: string;
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
}

interface SessionsGridProps {
  sessions: Session[];
  enrolledSessions: Array<string | number>;
  onEnroll: (session: Session) => void;
}

const SessionsGrid: React.FC<SessionsGridProps> = ({ sessions, enrolledSessions, onEnroll }) => {
  return (
    <div className="mt-[60px] w-full max-w-[1600px] flex justify-center gap-[40px] flex-wrap">
      {sessions.map((session) => (
        <SessionCard
          key={session.id}
          session={session}
          isEnrolled={enrolledSessions.includes(session.id)}
          onEnroll={onEnroll}
        />
      ))}
    </div>
  );
};

export default SessionsGrid;
