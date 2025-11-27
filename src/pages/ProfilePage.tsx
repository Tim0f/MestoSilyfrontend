import { useEffect, useState } from "react";
import Logo2 from "../assets/svg/Logo2.svg";
import Vector from "../assets/svg/Vector.svg";
import LogoSvg from "../assets/svg/Rectangle_9.svg?react";

export default function ProfilePage() {
  const [achievements, setAchievements] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  const sectionsList = [
    { id: "fencing", title: "фехтование" },
    { id: "stage-fencing", title: "актерское фехтование" },
    { id: "shooting", title: "стрельба" },
    { id: "dnd", title: "D&D" },
  ];

  const [activeSection, setActiveSection] = useState("stage-fencing");

  const fallback = [
    {
      name: "Первое занятие",
      description: "Посетил первое занятие",
      iconUrl: Vector,
      rewardGrains: 50,
      sectionId: "fencing",
      isActive: true,
    },
    {
      name: "Вернулся",
      description: "Пришел снова",
      iconUrl: Vector,
      rewardGrains: 70,
      sectionId: "stage-fencing",
      isActive: false,
    },
    {
      name: "Одобрение наставника",
      description: "Учитель доволен",
      iconUrl: Vector,
      rewardGrains: 50,
      sectionId: "shooting",
      isActive: true,
    },
    {
      name: "Герой подземелий",
      description: "Первый raid пройден",
      iconUrl: Vector,
      rewardGrains: 50,
      sectionId: "dnd",
      isActive: true,
    },
  ];

  useEffect(() => {
    fetch("/api/achievements")
      .then((r) => r.json())
      .then((d) => setAchievements(d))
      .catch(() => setAchievements(fallback));
  }, []);

  const list = achievements?.length ? achievements : fallback;

  // фильтр по секции
  const filteredBySection = list.filter((a) => a.sectionId === activeSection);

  // общий фильтр
  const filtered =
    activeSection === "general" ? list : filteredBySection;

  return (
    <div className="text-white bg-[#2D282A] min-h-screen p-6 space-y-6">

      {/* ======= ВЕРХНИЕ 3 КАРТОЧКИ ======= */}
      <div className="flex gap-6 w-full">
        <div
          className="bg-[#2D282A] border border-[#403B36] rounded-2xl p-6 flex items-center gap-6 relative overflow-hidden"
          style={{ width: "629px", height: "448px" }}
        >
          <div className="absolute inset-0 border border-[#8E6F4C] rounded-2xl pointer-events-none opacity-20" />

          <img
            src="/mnt/data/d9c29b55-e1c2-41ee-a900-275a2ac7bd88.png"
            className="w-24 h-24 rounded-xl object-cover"
          />

          <div className="flex flex-col gap-1 text-sm">
            <h1 className="text-xl font-h2">TestUser</h1>
            <p className="text-primary-300">polly@gmail.com</p>
            <p className="text-primary-300">01.2025.07</p>
          </div>

          <button className="absolute top-4 right-4 text-xs bg-[#F6C98F] text-black px-3 py-1 rounded-lg font-h2 hover:brightness-90">
            изменить
          </button>
        </div>

        <div
          className="bg-[#2D282A] border border-[#403B36] rounded-2xl p-6 relative"
          style={{ width: "715px", height: "448px" }}
        >
          <div className="absolute inset-0 border border-[#8E6F4C] rounded-2xl opacity-20" />

          <h2 className="text-lg font-h2 mb-4">Расписание на сегодня</h2>

          <div className="w-full flex flex-col gap-6 overflow-y-auto pr-2 text-sm">
            <div className="relative bg-[#2D282A] rounded-2xl p-6 border border-[#403B36] flex justify-between items-start">
              <div className="absolute inset-0 border border-[#8E6F4C] rounded-2xl opacity-20" />

              <div>
                <h3 className="font-h2 text-xl leading-tight mb-4">
                  Актерское <br /> Фехтование
                </h3>
                <p className="text-[#E8E1DC] font-p text-base leading-snug max-w-[360px]">
                  Откройте для себя искусство владения клинком.
                </p>
              </div>

              <div className="text-right font-h2 text-xl">
                <p>01.02</p>
                <p className="text-xl mt-2">18:00</p>
              </div>
            </div>
          </div>
        </div>

        <div
          className="bg-[#2D282A] border border-[#403B36] rounded-2xl p-6 relative flex flex-col justify-between"
          style={{ width: "442px", height: "448px" }}
        >
          <div className="absolute inset-0 border border-[#8E6F4C] rounded-2xl opacity-20" />

          <div>
            <h2 className="text-lg font-h1">Ваш баланс</h2>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-customyellow text-3xl font-h1">40</p>
              <img src={Logo2} className="w-6 h-6" />
            </div>
          </div>

          <button className="bg-[#F6C98F] text-black font-h2 px-6 py-2 rounded-xl shadow hover:brightness-90 text-sm">
            перевести
          </button>
        </div>
      </div>

      {/* ========= ЗАГОЛОВОК / ФИЛЬТРЫ ========= */}
      <div className="flex items-center justify-center flex-col">
        <h2 className="text-[52px] font-h1 text-[#F6C98F] mt-8 tracking-wide">
          ДОСТИЖЕНИЯ
        </h2>

        <div className="flex flex-row gap-6 mt-6 relative">

          {/* ======== "ОБЩИЕ" ======== */}
          <button
            onClick={() => {
              setActiveTab("general");
              setActiveSection("general");
            }}
            className="relative"
          >
            <LogoSvg
              width={233}
              height={81}
              className={`z-10  ${
                activeTab === "general"
                  ? "fill-customyellow"
                  : "opacity-60 hover:opacity-100 fill-customyellow"
              }`}
            />

            <span
              className={`absolute inset-0 flex items-center justify-center z-20 font-h1 text-2xl ${
                activeTab === "general" ? "text-customblack" : "text-[#F6C98F]"
              }`}
            >
              Общие
            </span>
          </button>

          {/* ======== "СЕКЦИИ" + ВЫПАДУШКА ======== */}
          <div className="relative">
            <button
              onClick={() => {
                setActiveTab("sections");
                setOpenDropdown(!openDropdown);
              }}
              className="relative"
            >
              <LogoSvg
                width={233}
                height={81}
                color="customyellow"
                className={`z-10  ${
                  activeTab === "sections"
                    ? ""
                    : "opacity-60 hover:opacity-100"
                }`}
              />
              <span
                className={`absolute inset-0 flex items-center justify-center z-20 font-h1 text-2xl ${
                  activeTab === "sections"
                    ? "text-customblack" : "text-[#F6C98F]"
                }`}
              >
                Секции
              </span>

              <span
                className={`absolute right-6 top-1/2 -translate-y-1/2 text-xl z-30 transition-transform ${
                  openDropdown ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>

            {openDropdown && (
              <div className="absolute left-0 top-[100%] mt-2 w-[233px] bg-[#2D282A] border border-[#F6C98F] rounded-xl p-6 space-y-5 z-20">
                {sectionsList.map((sec) => (
                  <div
                    key={sec.id}
                    className="flex items-center gap-4 cursor-pointer"
                    onClick={() => {
                      setActiveSection(sec.id);
                      setOpenDropdown(false);
                    }}
                  >
                    <div
                      className={`w-7 h-7 rounded-full border-2 border-[#F6C98F] ${
                        activeSection === sec.id ? "bg-[#F6C98F]" : ""
                      }`}
                    ></div>

                    <p className="font-h1 text-2xl">{sec.title}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

{/* ========= СПИСОК ДОСТИЖЕНИЙ ========= */}
<div className="mt-12 flex flex-col gap-6 w-full max-w-4xl mx-auto">
  {filtered.map((a, i) => (
    <div
      key={i}
      className="flex items-center justify-between bg-[#2D282A] border border-[#403B36] rounded-2xl px-6 py-4 relative"
    >
      <div className="absolute inset-0 border border-[#8E6F4C] rounded-2xl opacity-20" />

      {/* Левая часть: иконка + текст */}
      <div className="flex items-center gap-4">
        <img src={a.iconUrl} className="w-12 h-12" />

        <div className="flex flex-col">
          <h3 className="font-h1 text-2xl text-[#F6C98F] leading-none">
            {a.name}
          </h3>

          <p className="text-base text-[#E8E1DC] mt-1">
            {a.description}
          </p>
        </div>
      </div>

      {/* Правая часть: награда или кнопка */}
      <div className="flex items-center gap-4">
        {a.isActive ? (
          <button className="bg-[#F6C98F] text-black font-h2 px-6 py-2 rounded-xl shadow hover:brightness-90 text-sm">
            получить
          </button>
        ) : (
          <div className="bg-[#403B36] text-[#8E857F] font-h2 px-6 py-2 rounded-xl text-sm">
            получено
          </div>
        )}

        {/* иконка + цифра */}
        <div className="flex items-center gap-2">
          <span className="text-customyellow text-xl font-h1">
            {a.rewardGrains}
          </span>
          <img src={Logo2} className="w-5 h-5" />
        </div>
      </div>
    </div>
  ))}
</div>

    </div>
  );
}
