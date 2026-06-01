import { lazy, Suspense, useEffect, useState } from "react";
import Zerno from "../assets/svg/Zerno.svg?react";
import LogoSvg from "../assets/svg/button.svg?react";

import { Client } from "../services/httpClient";
import { UsersFrontendService } from "../services/users.service";
import { AchievementsFrontendService } from "../services/achievements.service";
import { LessonsFrontendService } from "../services/lessons.service";
import { SectionsFrontendService } from "../services/sections.service";
const AchievementCodeModal = lazy(
  () => import("../components/achievements/AchievementCodeModal")
);


interface Achievement {
  name: string;
  description: string;
  iconUrl: string;
  rewardGrains: number;
  sectionId: string;
  isActive: boolean;
}

interface User {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  avatarUrl: string;
  totalGrains: number;
}

interface ScheduleItem {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
}

interface Section {
  id: string;
  name: string;
}

export default function ProfilePage() {
  const [userData, setUserData] = useState<User | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [sections, setSections] = useState<Section[]>([]);

  const [openDropdown, setOpenDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "sections">("general");
  const [activeSection, setActiveSection] = useState<string>("general");
  
  const [modalOpen, setModalOpen] = useState(false);
  const [achievementCode, setAchievementCode] = useState("");

  const client = Client;

  const usersService = new UsersFrontendService(client);
  const achievementsService = new AchievementsFrontendService(client);
  const lessonsService = new LessonsFrontendService(client);
  const sectionsService = new SectionsFrontendService(client);

  useEffect(() => {
    usersService.getMyProfile<User>()
      .then((data) => {
        setUserData({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          avatarUrl: data.avatarUrl ?? "/no-avatar.png",
          totalGrains: data.totalGrains ?? 0,
          dateOfBirth: new Date(data.dateOfBirth).toISOString().slice(0, 10),
        });
      })
      .catch(() => console.warn("Ошибка загрузки профиля"));

    achievementsService.findAll<Achievement[]>()
      .then((data) => setAchievements(Array.isArray(data) ? data : []))
      .catch(() => console.warn("Ошибка загрузки ачивок"));

    lessonsService.findAll<ScheduleItem[]>()
      .then((data) => setSchedule(Array.isArray(data) ? data : []))
      .catch(() => console.warn("Ошибка загрузки расписания"));

    sectionsService.findAll<Section[]>()
      .then((data) => setSections(Array.isArray(data) ? data : []))
      .catch(() => console.warn("Ошибка загрузки секций"));
  }, []);

  const filteredAchievements =
    activeSection === "general"
      ? achievements
      : achievements.filter((a) => a.sectionId === activeSection);

  if (!userData) return null;

  const handleSubmitCode = () => {
    console.log("Получить достижение с кодом:", achievementCode);
    setAchievementCode("");
    setModalOpen(false);
    // Здесь можно вызвать API для получения достижения по коду
  };

  return (
    <div className="text-customwhite bg-customblack min-h-screen mt-14 md:mt-12 p-4 md:p-6 space-y-4 md:space-y-6">
      {/* PROFILE / SCHEDULE / BALANCE BLOCKS */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full">
        <div className="bg-customblack border border-customyellow/30 rounded-2xl p-4 md:p-6 flex flex-col sm:flex-row items-center gap-4 md:gap-6 relative overflow-hidden w-full md:w-[629px] h-auto md:h-[448px]">
          <div className="absolute inset-0 border border-customyellow/30 rounded-2xl pointer-events-none" />
          <img src={userData.avatarUrl} className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover" />
          <div className="flex flex-col gap-1 text-sm text-center sm:text-left">
            <h1 className="text-lg md:text-xl font-h2">{userData.firstName} {userData.lastName}</h1>
            <p className="text-customgrey">Дата рождения: {userData.dateOfBirth}</p>
            <p className="text-customgrey">{userData.email}</p>
          </div>
        </div>

        <div className="bg-customblack border border-customyellow/30 rounded-2xl p-4 md:p-6 relative w-full md:w-[715px] h-auto md:h-[448px]">
          <div className="absolute inset-0 border border-customyellow/30 rounded-2xl" />
          <h2 className="text-base md:text-lg font-h2 mb-3 md:mb-4">Расписание на сегодня</h2>
          <div className="w-full flex flex-col gap-4 md:gap-6 overflow-y-auto pr-2 text-sm max-h-[280px] md:max-h-none">
            {schedule.map((item) => (
              <div key={item.id} className="relative bg-customblack rounded-2xl p-4 md:p-6 border border-customyellow/30 flex flex-col sm:flex-row justify-between items-start gap-3">
                <div className="absolute inset-0 border border-customyellow/30 rounded-2xl" />
                <div>
                  <h3 className="font-h2 text-lg md:text-xl leading-tight mb-2 md:mb-4">{item.title}</h3>
                  <p className="text-customgrey font-p text-sm md:text-base leading-snug max-w-[360px]">{item.description}</p>
                </div>
                <div className="text-right font-h2 text-lg md:text-xl sm:text-right w-full sm:w-auto">
                  <p>{item.date}</p>
                  <p className="text-lg md:text-xl mt-1 md:mt-2">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-customblack border border-customyellow/30 rounded-2xl p-4 md:p-6 relative flex flex-col justify-between w-full md:w-[442px] h-auto md:h-[448px]">
          <div className="absolute inset-0 border border-customyellow/30 rounded-2xl" />
          <div className="flex items-center justify-center md:justify-start gap-2 md:gap-4 flex-wrap">
            <p className="text-customyellow text-[80px] md:text-[170px] font-h1 leading-none">{userData.totalGrains}</p>
            <Zerno className="w-20 h-20 md:w-40 md:h-40 text-customyellow" />
          </div>
        </div>
      </div>

      {/* ACHIEVEMENTS FILTER */}
      <div className="flex items-center justify-center flex-col">
        <h2 className="text-3xl md:text-[52px] font-h1 text-customyellow mt-6 md:mt-8 tracking-wide text-center">
          ДОСТИЖЕНИЯ
        </h2>

        <div className="flex flex-col md:flex-row gap-4 mt-4 md:mt-6 relative items-center">
          {/* Новая кнопка "Получить достижение" */}
          <button
            onClick={() => setModalOpen(true)}
            className="bg-customyellow text-customblack font-h2 px-6 py-2 rounded-xl hover:brightness-90 w-full md:w-auto"
          >
            Получить достижение
          </button>

          <div className="flex flex-row gap-2 md:gap-4 items-center">
            <button onClick={() => { setActiveTab("general"); setActiveSection("general"); }} className="relative">
              <LogoSvg width={180} height={60} className={`z-10 md:w-[233px] md:h-[81px] ${activeTab === "general" ? "fill-customyellow" : " fill-customyellow"}`} />
              <span className={`absolute inset-0 flex items-center justify-center z-20 font-h1 text-lg md:text-2xl ${activeTab === "general" ? "text-customblack" : "text-customyellow"}`}>Общие</span>
            </button>

            <div className="relative">
              <button onClick={() => { setActiveTab("sections"); setOpenDropdown(!openDropdown); }} className="relative">
                <LogoSvg width={180} height={60} className={`z-10 md:w-[233px] md:h-[81px] ${activeTab === "sections" ? "" : " fill-customblack stroke-customyellow"}`} />
                <span className={`absolute inset-0 flex items-center justify-center z-20 font-h1 text-lg md:text-2xl ${activeTab === "sections" ? "text-customblack" : "text-customyellow"}`}>Секции</span>
                <span className={`absolute right-4 md:right-6 top-1/2 -translate-y-1/2 text-base md:text-xl z-30 transition-transform ${openDropdown ? "rotate-180" : ""}`}>▼</span>
              </button>

              {openDropdown && (
                <div className="absolute left-0 top-[100%] mt-2 w-full md:w-[233px] bg-customblack border border-customyellow rounded-xl p-4 md:p-6 space-y-4 md:space-y-5 z-20">
                  {sections.map((sec) => (
                    <div key={sec.id} className="flex items-center gap-3 md:gap-4 cursor-pointer" onClick={() => { setActiveSection(sec.id); setOpenDropdown(false); }}>
                      <div className={`w-5 h-5 md:w-7 md:h-7 rounded-full border-2 border-customyellow ${activeSection === sec.id ? "bg-customyellow" : ""}`}></div>
                      <p className="font-h1 text-lg md:text-2xl">{sec.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ACHIEVEMENTS LIST */}
      <div className="mt-8 md:mt-12 flex flex-col gap-4 md:gap-6 w-full max-w-4xl mx-auto">
        {filteredAchievements.map((a, i) => (
          <div key={i} className="flex flex-col md:flex-row items-center justify-between bg-customblack border border-customyellow/30 rounded-2xl px-4 md:px-6 py-4 relative gap-4">
            <div className="absolute inset-0 border border-customyellow/30 rounded-2xl" />
            <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
              <img src={a.iconUrl} className="w-10 h-10 md:w-12 md:h-12" />
              <div className="flex flex-col text-center md:text-left">
                <h3 className="font-h1 text-xl md:text-2xl text-customyellow leading-none">{a.name}</h3>
                <p className="text-sm md:text-base text-customgrey mt-1">{a.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto justify-center md:justify-end">
              {a.isActive ? (
                <button className="bg-customyellow text-customblack font-h2 px-5 py-2 rounded-xl shadow hover:brightness-90 text-sm">получить</button>
              ) : (
                  <div className="bg-customgrey text-customwhite font-h2 px-5 py-2 rounded-xl text-sm">получено</div>
              )}
              <div className="flex items-center gap-1 md:gap-2">
                <span className="text-customyellow text-lg md:text-xl font-h1">{a.rewardGrains}</span>
                <Zerno className="w-4 h-4 md:w-5 md:h-5 text-customyellow" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* МОДАЛЬНОЕ ОКНО */}
      <Suspense fallback={null}>
        <AchievementCodeModal
          open={modalOpen}
          code={achievementCode}
          onChange={setAchievementCode}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmitCode}
        />
      </Suspense>
    </div>
  );
}