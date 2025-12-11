// Updated SessionsModal.tsx
import React, { useEffect, useState } from "react";
import BaseModal from "../ui/BaseModal";
import { LessonsFrontendService } from "../../services/lessons.service";
import { Client } from "../../services/httpClient";

const client = Client;
const lessonsService = new LessonsFrontendService(client);

interface LessonItem {
  id: string;
  date: string;
  startsAt: string;
  endsAt: string;
  location: string | null;
  section: { id: string; name: string };
  teacher: { id: string; firstName: string; lastName: string } | null;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SessionsModal({ isOpen, onClose }: Props) {
  const [date, setDate] = useState<string>("");
  const [rangeStart, setRangeStart] = useState<string>("");
  const [rangeEnd, setRangeEnd] = useState<string>("");
  const [lessons, setLessons] = useState<LessonItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadByDate = async () => {
    if (!date) return;
    setLoading(true);
    const res = await lessonsService.findByDate<LessonItem[]>(date);
    setLessons(res);
    setLoading(false);
  };

  const loadByRange = async () => {
    if (!rangeStart || !rangeEnd) return;
    setLoading(true);
    const res = await lessonsService.findByDateRange<LessonItem[]>(rangeStart, rangeEnd);
    setLessons(res);
    setLoading(false);
  };

  const groupByDate = lessons.reduce<Record<string, LessonItem[]>>((acc, item) => {
    if (!acc[item.date]) acc[item.date] = [];
    acc[item.date].push(item);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupByDate).sort();

  useEffect(() => {
    if (isOpen) {
      setLessons([]);
      setDate("");
      setRangeStart("");
      setRangeEnd("");
    }
  }, [isOpen]);

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Расписание уроков">
      <div className="text-white space-y-6 max-h-[75vh] overflow-y-auto">
        {/* DATE FILTER */}
        <div className="p-4 border border-white/20 rounded-lg">
          <h2 className="text-xl font-bold mb-3">Фильтр по дате</h2>
          <div className="flex gap-4 items-center mb-4">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="text-black px-3 py-2 rounded"
            />
            <button
              onClick={loadByDate}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-black rounded font-semibold"
            >
              Загрузить
            </button>
          </div>
        </div>

        {/* RANGE FILTER */}
        <div className="p-4 border border-white/20 rounded-lg">
          <h2 className="text-xl font-bold mb-3">Фильтр по диапазону дат</h2>
          <div className="flex gap-4 items-center mb-4">
            <input
              type="date"
              value={rangeStart}
              onChange={(e) => setRangeStart(e.target.value)}
              className="text-black px-3 py-2 rounded"
            />
            <input
              type="date"
              value={rangeEnd}
              onChange={(e) => setRangeEnd(e.target.value)}
              className="text-black px-3 py-2 rounded"
            />
            <button
              onClick={loadByRange}
              className="px-4 py-2 bg-green-500 hover:bg-green-400 text-black rounded font-semibold"
            >
              Загрузить
            </button>
          </div>
        </div>

        {/* RESULTS */}
        {loading ? (
          <p className="text-white">Загрузка…</p>
        ) : lessons.length === 0 ? (
          <p className="text-white/60">Нет уроков</p>
        ) : (
          <div className="overflow-x-auto border border-white/20 rounded p-4">
            <div className="min-w-max grid" style={{ gridTemplateColumns: `repeat(${sortedDates.length}, 280px)` }}>
              {sortedDates.map((d) => (
                <div key={d} className="border border-white/10 p-3">
                  <h3 className="font-bold text-lg mb-3">{d}</h3>

                  {groupByDate[d]
                    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
                    .map((l) => (
                      <div key={l.id} className="mb-3 p-3 bg-white/5 rounded">
                        <p>
                          <b>{l.section.name}</b>
                        </p>
                        <p>
                          {l.startsAt} — {l.endsAt}
                        </p>
                        <p className="text-white/70 text-sm">
                          Учитель: {l.teacher ? `${l.teacher.firstName} ${l.teacher.lastName}` : "—"}
                        </p>
                        <p className="text-white/70 text-sm">Место: {l.location ?? "—"}</p>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </BaseModal>
  );
}
