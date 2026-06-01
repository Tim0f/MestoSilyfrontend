import  { useEffect, useState } from "react";

import { Client } from "../services/httpClient";

import { EnrollmentsFrontendService } from "../services/enrollments.service";

import { SectionsFrontendService } from "../services/sections.service";

import { LessonsFrontendService } from "../services/lessons.service";

  

const client = Client;

  

const enrollService = new EnrollmentsFrontendService(client);

const sectionsService = new SectionsFrontendService(client);

const lessonsService = new LessonsFrontendService(client);

  

export default function AdminEnrollmentsPage() {

  const [sections, setSections] = useState<any[]>([]);

  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  

  const [lessons, setLessons] = useState<any[]>([]);

  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);

  

  const [enrollments, setEnrollments] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  

  /** Загрузка секций */

  useEffect(() => {

    const loadSections = async () => {

      const data = await sectionsService.findAll<any[]>();

      setSections(data);

    };

    loadSections();

  }, []);

  

  /** При выборе секции загружаем уроки */

  useEffect(() => {

    if (!selectedSection) return;

  

    const loadLessons = async () => {

      const list = await lessonsService.findAll<any[]>(selectedSection);

      setLessons(list);

      setSelectedLesson(null);

      setEnrollments([]);

    };

  

    loadLessons();

  }, [selectedSection]);

  

  /** При выборе урока загружаем записи */

  useEffect(() => {

    if (!selectedLesson) return;

  

    const loadEnrollments = async () => {

      setLoading(true);

      try {

        const data = await enrollService.listBySection<any[]>(selectedSection!);

  

        // фильтруем только для выбранного урока

        const filtered = data.filter((e: any) => e.lessonId === selectedLesson);

  

        setEnrollments(filtered);

      } finally {

        setLoading(false);

      }

    };

  

    loadEnrollments();

  }, [selectedLesson]);

  

  return (

    <div className="p-10 text-customwhite space-y-10">

      <h1 className="text-4xl font-bold mb-6">Записи на занятия</h1>

  

      {/* ========================= СЕКЦИИ ========================= */}

      <div>

        <h2 className="text-2xl font-semibold mb-2">Секции</h2>

  

        <div className="flex flex-wrap gap-3">

          {sections.map((s) => (

            <button

              key={s.id}

              className={`px-4 py-2 rounded ${

                selectedSection === s.id

                  ? "bg-customyellow text-customblack"

                  : "bg-customgrey"

              }`}

              onClick={() => setSelectedSection(s.id)}

            >

              {s.name}

            </button>

          ))}

        </div>

      </div>

  

      {/* ========================= УРОКИ ========================= */}

      {selectedSection && (

        <div>

          <h2 className="text-2xl font-semibold mt-6 mb-2">Уроки секции</h2>

  

          {lessons.length === 0 ? (

            <p className="text-customwhite/50">Нет уроков</p>

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {lessons.map((l) => (

                <div

                  key={l.id}

                  onClick={() => setSelectedLesson(l.id)}

                  className={`p-4 border rounded cursor-pointer ${

                    selectedLesson === l.id

                      ? "border-customyellow bg-customgrey"

                      : "border-customgrey bg-customgrey"

                  }`}

                >

                  <p className="text-lg font-bold">

                    {l.startsAt} – {l.endsAt}

                  </p>

                  <p className="text-customwhite/70">

                    Преподаватель:{" "}

                    {l.teacher

                      ? `${l.teacher.firstName} ${l.teacher.lastName}`

                      : "Не указан"}

                  </p>

  

                  <p className="text-customwhite/60 text-sm mt-1">

                    Записано: {l._count?.enrollments ?? 0}

                  </p>

                </div>

              ))}

            </div>

          )}

        </div>

      )}

  

      {/* ========================= СПИСОК ЗАПИСЕЙ ========================= */}

      {selectedLesson && (

        <div>

          <h2 className="text-2xl font-semibold mt-10 mb-4">

            Записанные ученики

          </h2>

  

          {loading ? (

            <p className="text-customwhite/60">Загрузка...</p>

          ) : enrollments.length === 0 ? (

            <p className="text-customwhite/50">Нет записей на этот урок</p>

          ) : (

            <table className="w-full text-left border-collapse">

              <thead>

                <tr className="border-b border-customgrey">

                  <th className="p-3">Имя</th>

                  <th className="p-3">Email</th>

                  <th className="p-3">Дата записи</th>

                </tr>

              </thead>

              <tbody>

                {enrollments.map((e) => (

                  <tr key={e.id} className="border-b border-customgrey">

                    <td className="p-3">

                      {e.user?.firstName} {e.user?.lastName}

                    </td>

                    <td className="p-3">{e.user?.email}</td>

                    <td className="p-3">

                      {new Date(e.enrolledAt).toLocaleString("ru-RU")}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          )}

        </div>

      )}

    </div>

  );

}