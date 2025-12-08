// src/components/lessons/SessionsModal.tsx

import React, { useEffect, useState } from "react";
import BaseModal from "../ui/BaseModal";
import { SessionsFrontendService } from "../../services/sessions.service";
import { Client } from "../../services/httpClient";

const client = Client;

const sessionsService = new SessionsFrontendService(client);

// ---------- Типы ----------
interface SessionLesson {
  id: string;
  startsAt: string;
  endsAt: string;
  location: string | null;
  section: { id: string; name: string };
  teacher: { id: string; firstName: string; lastName: string } | null;
}

interface SessionEvent {
  id: string;
  name: string;
  date: string;
  _count: { eventRegistrations: number };
}

interface SessionsResponse {
  year: number;
  month: number;
  sessions: SessionLesson[];
  events: SessionEvent[];
}

interface ImportResponse {
  success: boolean;
  created: number;
  errors: number;
  details: {
    createdSessions: any[];
    errorMessages: string[];
  };
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SessionsModal({ isOpen, onClose }: Props) {
  const [data, setData] = useState<SessionsResponse | null>(null);

  // XLSX
  const [file, setFile] = useState<File | null>(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importResult, setImportResult] = useState<ImportResponse | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const load = async () => {
    const res = await sessionsService.findAll<SessionsResponse>();
    setData(res);
  };

  useEffect(() => {
    if (isOpen) {
      load();
      setImportError(null);
      setImportResult(null);
      setFile(null);
    }
  }, [isOpen]);

  // ---------- СКАЧАТЬ ШАБЛОН ----------
  const handleDownloadTemplate = async () => {
    try {
      const buffer = await sessionsService.downloadTemplate();

      const blob = new Blob([buffer], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "sessions_template.xlsx";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Template error:", err);
    }
  };

  // ---------- ИМПОРТ XLSX ----------
  const handleImport = async () => {
    if (!file) {
      setImportError("Выберите XLSX файл");
      return;
    }

    setImportError(null);
    setImportLoading(true);

    try {
      const res = await sessionsService.importSchedule<ImportResponse>(file);
      setImportResult(res);
      await load(); // обновить расписание
    } catch (err: any) {
      setImportError(err?.message ?? "Ошибка при импорте");
    } finally {
      setImportLoading(false);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Расписание (Sessions)">
      {!data ? (
        <p className="text-white">Загрузка…</p>
      ) : (
        <div className="space-y-6 text-white max-h-[70vh] overflow-y-auto">

          {/* ===================== БЛОК ИМПОРТА ===================== */}
          <div className="p-4 border border-white/20 rounded-lg">
            <h2 className="text-xl font-bold mb-3">Импорт расписания (XLSX)</h2>

            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={handleDownloadTemplate}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-black rounded font-semibold"
              >
                Скачать шаблон XLSX
              </button>
            </div>

            <input
              type="file"
              accept=".xlsx"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="text-white mb-3"
            />

            <button
              disabled={importLoading}
              onClick={handleImport}
              className="px-4 py-2 bg-green-500 hover:bg-green-400 text-black rounded font-semibold"
            >
              {importLoading ? "Загрузка..." : "Импортировать"}
            </button>

            {/* Ошибки */}
            {importError && (
              <p className="text-red-400 mt-3">{importError}</p>
            )}

            {/* ========== РЕЗУЛЬТАТ ИМПОРТА ========== */}
            {importResult && (
              <div className="mt-6 p-4 border border-white/20 rounded bg-black/20">
                <h3 className="text-lg font-bold mb-2">Результат импорта</h3>

                <p className="mb-2">
                  Создано: <b>{importResult.created}</b>, ошибок:{" "}
                  <b>{importResult.errors}</b>
                </p>

                {/* ---- ТАБЛИЦА СОЗДАННЫХ УРОКОВ ---- */}
                {importResult.details.createdSessions.length > 0 && (
                  <div className="mt-4">
                    <p className="font-semibold mb-2">Созданные занятия:</p>

                    <table className="w-full text-sm border border-white/20">
                      <thead className="bg-white/10">
                        <tr>
                          <th className="p-2 border border-white/20">Секция</th>
                          <th className="p-2 border border-white/20">Время</th>
                          <th className="p-2 border border-white/20">Учитель</th>
                          <th className="p-2 border border-white/20">Место</th>
                        </tr>
                      </thead>
                      <tbody>
                        {importResult.details.createdSessions.map((s, i) => (
                          <tr key={i} className="hover:bg-white/5">
                            <td className="p-2 border border-white/10">
                              {s.section?.name ?? "—"}
                            </td>
                            <td className="p-2 border border-white/10">
                              {s.startsAt} — {s.endsAt}
                            </td>
                            <td className="p-2 border border-white/10">
                              {s.teacher
                                ? `${s.teacher.firstName} ${s.teacher.lastName}`
                                : "—"}
                            </td>
                            <td className="p-2 border border-white/10">
                              {s.location ?? "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* ---- ТАБЛИЦА ОШИБОК ---- */}
                {importResult.details.errorMessages.length > 0 && (
                  <div className="mt-6">
                    <p className="font-semibold text-red-300 mb-2">Ошибки:</p>

                    <table className="w-full text-sm border border-red-500/40">
                      <tbody>
                        {importResult.details.errorMessages.map((msg, i) => (
                          <tr key={i} className="hover:bg-red-500/10">
                            <td className="p-2 border border-red-500/40 text-red-300">
                              {msg}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ===================== УРОКИ ===================== */}
          <div>
            <h3 className="text-lg font-semibold mt-4">Уроки:</h3>
            {data.sessions.length === 0 ? (
              <p className="text-white/60">Нет уроков</p>
            ) : (
              data.sessions.map((s) => (
                <div key={s.id} className="p-3 border border-white/20 rounded">
                  <p>
                    <b>{s.section.name}</b> — {s.startsAt}–{s.endsAt}
                  </p>
                  <p>
                    Преподаватель:{" "}
                    {s.teacher
                      ? `${s.teacher.firstName} ${s.teacher.lastName}`
                      : "Не указан"}
                  </p>
                  <p>Место: {s.location ?? "—"}</p>
                </div>
              ))
            )}
          </div>

          {/* ===================== СОБЫТИЯ ===================== */}
          <div>
            <h3 className="text-lg font-semibold mt-4">События:</h3>
            {data.events.length === 0 ? (
              <p className="text-white/60">Нет событий</p>
            ) : (
              data.events.map((e) => (
                <div key={e.id} className="p-3 border border-white/20 rounded">
                  <p><b>{e.name}</b></p>
                  <p>Дата: {e.date}</p>
                  <p>Записалось: {e._count.eventRegistrations}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </BaseModal>
  );
}
