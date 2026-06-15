// src/pages/ProfilePage.tsx
import { lazy, Suspense, useEffect, useState } from "react";
import Zerno from "../assets/svg/Zerno.svg?react";
import LogoSvg from "../assets/svg/button.svg?react";
import LucideEdit from "../assets/svg/lucide_edit.svg?react";

import { Client } from "../services/httpClient";
import { UsersFrontendService } from "../services/users.service";
import { AchievementsFrontendService } from "../services/achievements.service";
import { SectionsFrontendService } from "../services/sections.service";
import { getAvatarUrl } from "../utils/avatars";
import {
  EnrollmentsFrontendService,
  Enrollment,
} from "../services/enrollments.service";
import { useAuth } from "../context/AuthContext";
import { getPublicUrl } from "../utils/publicUrl";

const AchievementCodeModal = lazy(() => import("../components/achievements/AchievementCodeModal"));
const ProfileEditModal = lazy(() => import("../components/profile/ProfileEditModal"));

interface Achievement {
  name: string;
  description: string;
  iconUrl: string;
  rewardGrains: number;
  sectionId: string;
  isActive: boolean;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  avatarID: number;
  email: string;
  dateOfBirth: string;
  phone?: string;
  totalGrains: number;
}

interface Section {
  id: string;
  name: string;
}

const combineDateTime = (dateIso: string, time: string): string => {
  const datePart = dateIso.slice(0, 10);
  return `${datePart}T${time}:00`;
};

export default function ProfilePage() {
  const { refreshUser } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const [openDropdown, setOpenDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "sections">("general");
  const [activeSection, setActiveSection] = useState<string>("general");

  const [modalOpen, setModalOpen] = useState(false);
  const [achievementCode, setAchievementCode] = useState("");
  const [redeemError, setRedeemError] = useState<string | null>(null);
  const [redeemSuccess, setRedeemSuccess] = useState(false);

  const client = Client;
  const usersService = new UsersFrontendService(client);
  const achievementsService = new AchievementsFrontendService(client);
  const sectionsService = new SectionsFrontendService(client);
  const enrollmentsService = new EnrollmentsFrontendService(client);

  useEffect(() => {
    usersService
      .getMyProfile<any>()
      .then((data) => {
        setUserId(data.id);
        setUserData({
          id: data.id,
          firstName: data.firstName,
          lastName: data.lastName,
          avatarID: data.avatarID ?? 1,
          email: data.email,
          phone: data.phone ?? "",
          totalGrains: data.totalGrains ?? 0,
          dateOfBirth: data.dateOfBirth
            ? new Date(data.dateOfBirth).toISOString().slice(0, 10)
            : "",
        });
      })
      .catch(() => console.warn("Ошибка загрузки профиля"));

    achievementsService
      .findAll<Achievement[]>()
      .then((data) => setAchievements(Array.isArray(data) ? data : []))
      .catch(() => console.warn("Ошибка загрузки ачивок"));

    enrollmentsService
      .getMyEnrollments()
      .then((data) => {
        const now = new Date();
        const upcoming = data
          .filter((e) => {
            if (e.status !== "APPROVED" || !e.lesson) return false;
            const { date, startsAt, endsAt } = e.lesson;
            if (!date || !startsAt || !endsAt) return false;
            const startDateTime = new Date(combineDateTime(date, startsAt));
            if (isNaN(startDateTime.getTime())) return false;
            return startDateTime > now;
          })
          .sort((a, b) => {
            const startA = new Date(combineDateTime(a.lesson!.date, a.lesson!.startsAt));
            const startB = new Date(combineDateTime(b.lesson!.date, b.lesson!.startsAt));
            return startA.getTime() - startB.getTime();
          });
        setEnrollments(upcoming);
      })
      .catch(() => console.warn("Ошибка загрузки записей"));

    sectionsService
      .findAll<Section[]>()
      .then((data) => setSections(Array.isArray(data) ? data : []))
      .catch(() => console.warn("Ошибка загрузки секций"));
  }, []);

  const filteredAchievements =
    activeSection === "general"
      ? achievements
      : achievements.filter((a) => a.sectionId === activeSection);

  if (!userData) return null;

  const formatDate = (isoDate: string): string => {
    const d = new Date(isoDate);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  const formatTime = (time: string): string => {
    if (!/^\d{2}:\d{2}$/.test(time)) return "—";
    const [hours, minutes] = time.split(":");
    const d = new Date();
    d.setHours(Number(hours), Number(minutes), 0, 0);
    return d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
  };

  const handleSubmitCode = async () => {
    if (!achievementCode.trim()) return;
    try {
      await achievementsService.redeemByCode({ code: achievementCode });
      setRedeemSuccess(true);
      setRedeemError(null);
      const data = await achievementsService.findAll<Achievement[]>();
      setAchievements(Array.isArray(data) ? data : []);
      setTimeout(() => {
        setModalOpen(false);
        setRedeemSuccess(false);
        setAchievementCode("");
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setRedeemError(err?.message || "Ошибка активации кода");
      setRedeemSuccess(false);
    }
  };

  const handleProfileSave = async (formData: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    phone: string;
    avatarID: number;
  }) => {
    if (!userId) return;
    try {
      await usersService.update<any>(userId, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        phone: formData.phone,
        avatarID: formData.avatarID,
      });
      setUserData((prev) =>
        prev
          ? {
              ...prev,
              firstName: formData.firstName,
              lastName: formData.lastName,
              dateOfBirth: formData.dateOfBirth,
              phone: formData.phone,
              avatarID: formData.avatarID,
            }
          : null
      );
      await refreshUser();
      setEditModalOpen(false);
    } catch {
      alert("Ошибка при сохранении");
    }
  };

  return (
    <div className="text-customwhite bg-customblack min-h-screen mt-14 md:mt-12 p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full">
        {/* Левый блок с профилем */}
        <div className="bg-customblack border border-customyellow/30 rounded-2xl p-6 relative overflow-hidden w-full md:w-[629px] h-auto md:h-[448px]">
          <div className="absolute inset-0 border border-customyellow/30 rounded-2xl pointer-events-none" />

          <button
            onClick={() => setEditModalOpen(true)}
            className="absolute top-6 right-6 rounded-lg p-2 hover:opacity-80 transition-all"
          >
            <LucideEdit className="w-10 h-10 text-customyellow z-10" />
          </button>

          <div className="flex flex-col md:flex-row items-center md:items-center gap-8 h-full">
            <img
              src={getAvatarUrl(userData.avatarID)}
              className="w-[180px] h-[180px] rounded-full object-cover border border-customyellow"
            />

            <div className="flex flex-col text-center md:text-left">
              <h1 className="text-4xl font-h1 text-customyellow">
                {userData.firstName} {userData.lastName}
              </h1>

              <p className="mt-4 text-customwhite">
                дата рождения: {formatDate(userData.dateOfBirth)}
              </p>

              <p className="text-customwhite">{userData.email}</p>
            </div>
          </div>
        </div>

        {/* Средний блок - Записи */}
        <div className="bg-customblack border border-customyellow/30 rounded-2xl p-4 md:p-6 relative w-full md:w-[715px] h-auto md:h-[448px]">
          <div className="absolute inset-0 border border-customyellow/30 rounded-2xl" />
          <h2 className="text-base md:text-lg font-h2 mb-3 md:mb-4">Мои ближайшие записи</h2>
          <div className="w-full flex flex-col gap-4 md:gap-6 overflow-y-auto pr-2 text-sm max-h-[280px] md:max-h-none">
            {enrollments.length === 0 ? (
              <p className="text-customgrey">Нет предстоящих записей</p>
            ) : (
              enrollments.map((enr) => (
                <div key={enr.id} className="relative bg-customblack rounded-2xl p-4 md:p-6 border border-customyellow/30 flex flex-col sm:flex-row justify-between items-start gap-3">
                  <div className="absolute inset-0 border border-customyellow/30 rounded-2xl" />
                  <div>
                    <h3 className="font-h2 text-lg md:text-xl leading-tight mb-2 md:mb-4">
                      {enr.section?.name || "Секция"}
                    </h3>
                    {enr.lesson?.location && (
                      <p className="text-customgrey text-xs mt-1">{enr.lesson.location}</p>
                    )}
                  </div>
                  <div className="text-right font-h2 text-lg md:text-xl sm:text-right w-full sm:w-auto">
                    <p>{formatDate(enr.lesson!.date)}</p>
                    <p className="text-lg md:text-xl mt-1 md:mt-2">
                      {formatTime(enr.lesson!.startsAt)} – {formatTime(enr.lesson!.endsAt)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Правый блок - баланс */}
        <div className="bg-customblack border border-customyellow/30 rounded-2xl p-6 relative flex flex-col justify-between w-full md:w-[442px] h-auto md:h-[448px]">
          <div className="absolute inset-0 border border-customyellow/30 rounded-2xl" />

          <div className="flex items-center justify-center gap-4 mt-8">
            <p className="text-customyellow text-[170px] font-h1 leading-none">
              {userData.totalGrains}
            </p>

            <Zerno className="w-[110px] h-[110px] text-customyellow" />
          </div>

          <div className="flex justify-center mb-8">
            <div className="flex justify-center mb-8">
              <button className="relative hover:brightness-90 transition-all">
                <LogoSvg
                  width={240}
                  height={80}
                  className="fill-customyellow z-10"
                />

                <span className="absolute inset-0 flex items-center justify-center gap-3 z-20 text-customblack font-h2 text-xl">
                  <span className="flex flex-col gap-[2px]">
                    <svg
                      width="26"
                      height="10"
                      viewBox="0 0 26 10"
                      fill="none"
                    >
                      <path
                        d="M1 5H24M24 5L20 1M24 5L20 9"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>

                    <svg
                      width="26"
                      height="10"
                      viewBox="0 0 26 10"
                      fill="none"
                    >
                      <path
                        d="M25 5H2M2 5L6 1M2 5L6 9"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  перевести
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Достижения */}
      <div className="flex items-center justify-center flex-col">
        <h2 className="text-h2 md:text-[52px] font-h1 text-customyellow mt-6 md:mt-8 tracking-wide text-center">ДОСТИЖЕНИЯ</h2>
        <div className="flex flex-col md:flex-row gap-4 mt-4 md:mt-6 relative items-center">
          <button onClick={() => setModalOpen(true)} className="bg-customyellow text-customblack font-h2 px-6 py-2 rounded-xl hover:brightness-90 w-full md:w-auto">Получить достижение</button>
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

      {/* Список достижений */}
      <div className="mt-8 md:mt-12 flex flex-col gap-4 md:gap-6 w-full max-w-4xl mx-auto">
        {filteredAchievements.map((a, i) => (
          <div key={i} className="flex flex-col md:flex-row items-center justify-between bg-customblack border border-customyellow/30 rounded-2xl px-4 md:px-6 py-4 relative gap-4">
            <div className="absolute inset-0 border border-customyellow/30 rounded-2xl" />
            <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
              <div
  className="w-10 h-10 md:w-12 md:h-12"
  style={{
    WebkitMaskImage: `url(${getPublicUrl(a.iconUrl)})`,
    maskImage: `url(${getPublicUrl(a.iconUrl)})`,
    WebkitMaskSize: 'contain',
    maskSize: 'contain',
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    backgroundColor: 'rgb(var(--color-customyellow))',
  }}
/>
              <div className="flex flex-col text-center md:text-left">
                <h3 className="font-h1 text-xl md:text-2xl text-customwhite leading-none">{a.name}</h3>
                <p className="text-sm md:text-base text-customwhite mt-1">{a.description}</p>
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

      <Suspense fallback={null}>
        <AchievementCodeModal
          open={modalOpen}
          code={achievementCode}
          onChange={(value) => {
            setAchievementCode(value);
            setRedeemError(null);
          }}
          onClose={() => {
            setModalOpen(false);
            setRedeemError(null);
            setAchievementCode("");
          }}
          onSubmit={handleSubmitCode}
          error={redeemError}
          success={redeemSuccess}
        />
        <ProfileEditModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSave={handleProfileSave}
          initial={{
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            dateOfBirth: userData.dateOfBirth || "",
            phone: userData.phone || "",
            avatarID: userData.avatarID,
          }}
        />
      </Suspense>
    </div>
  );
}