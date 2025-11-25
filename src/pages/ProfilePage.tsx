// Full updated ProfilePage component with adjusted sizes
import { useEffect, useState } from "react";
import Logo2 from "../assets/svg/Logo2.svg";
import Vector from "../assets/svg/Vector.svg";

export default function ProfilePage() {
  const [achievements, setAchievements] = useState([]);

  const fallback = [
    {
      name: "Первое занятие",
      description: "Посетил первое занятие",
      iconUrl: Vector,
      rewardGrains: 50,
      sectionId: "section-1",
      isActive: true,
    },
    {
      name: "Второе занятие",
      description: "Вернулся ещё раз",
      iconUrl: Vector,
      rewardGrains: 70,
      sectionId: "section-1",
      isActive: false,
    },
  ];

  useEffect(() => {
    fetch("/api/achievements")
      .then((res) => res.json())
      .then((data) => setAchievements(data))
      .catch(() => setAchievements(fallback));
  }, []);

  return (
    <div className="text-white bg-[#2D282A] min-h-screen p-6 space-y-6">
      {/* === WRAPPER: 3 cards === */}
      <div className="flex gap-6 w-full">
        {/* === PROFILE CARD === */}
        <div className="bg-[#2D282A] border border-[#403B36] rounded-2xl p-6 flex items-center gap-6 relative overflow-hidden"
             style={{ width: "629px", height: "448px" }}>

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

        {/* === TODAY CARD === */}
        <div className="bg-[#2D282A] border border-[#403B36] rounded-2xl p-6 relative"
             style={{ width: "715px", height: "448px" }}>

          <div className="absolute inset-0 border border-[#8E6F4C] rounded-2xl opacity-20" />

          <h2 className="text-lg font-h2 mb-4">Расписание на сегодня</h2>

          <div className="w-full flex flex-col gap-6 overflow-y-auto pr-2 text-sm">
            {/* CARD 1 */}
            <div className="relative bg-[#2D282A] rounded-2xl p-6 border border-[#403B36] flex justify-between items-start">
              <div className="absolute inset-0 border border-[#8E6F4C] rounded-2xl opacity-20" />

              <div>
                <h3 className="font-h2 text-xl leading-tight mb-4">
                  Актерское <br /> Фехтование
                </h3>
                <p className="text-[#E8E1DC] font-p text-base leading-snug max-w-[360px]">
                  Откройте для себя искусство владения клинком.
                  От базовых стоек до изящных атак.
                </p>
              </div>

              <div className="text-right font-h2 text-xl">
                <p>01.02</p>
                <p className="text-xl mt-2">18:00</p>
              </div>
            </div>

            {/* CARD 2 */}
            <div className="relative bg-[#2D282A] rounded-2xl p-6 border border-[#403B36] flex justify-between items-start">
              <div className="absolute inset-0 border border-[#8E6F4C] rounded-2xl opacity-20" />

              <div>
                <h3 className="font-h2 text-xl leading-tight mb-4">
                  Актерское <br /> Фехтование
                </h3>
                <p className="text-[#E8E1DC] font-p text-base leading-snug max-w-[360px]">
                  Откройте для себя искусство владения клинком.
                  От базовых стоек до изящных атак.
                </p>
              </div>

              <div className="text-right font-h2 text-xl">
                <p>01.02</p>
                <p className="text-xl mt-2">18:00</p>
              </div>
            </div>
          </div>
        </div>

        {/* === BALANCE === */}
        <div className="bg-[#2D282A] border border-[#403B36] rounded-2xl p-6 relative flex flex-col justify-between"
             style={{ width: "442px", height: "448px" }}>

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

      {/* === ACHIEVEMENTS HEADER === */}
      <h2 className="text-2xl font-h1 mt-8">ДОСТИЖЕНИЯ</h2>

      <div className="flex gap-6 text-base font-h1">
        <button className="text-[#F6C98F]">Общие</button>
        <button className="text-white/40 hover:text-white">Секции</button>
      </div>

      {/* === ACHIEVEMENTS LIST === */}
      <div className="space-y-4 text-sm">
        {achievements.map((item, i) => (
          <div
            key={i}
            className="relative bg-[#2D282A] border border-[#403B36] rounded-xl p-4 flex items-center justify-between"
          >
            <div className="absolute inset-0 border border-[#8E6F4C] rounded-xl opacity-20" />

            <div className="flex items-center gap-4">
              <img src={item.iconUrl} className="w-10 h-10 object-contain" />

              <div>
                <h3 className="font-h1 text-base">{item.name}</h3>
                <p className="text-primary-300 text-xs">{item.description}</p>
                <p className="text-yellow-400 font-h1 mt-1 text-sm">+{item.rewardGrains}</p>
              </div>
            </div>

            {item.isActive ? (
              <button className="bg-[#F6C98F] text-black font-h1 px-4 py-2 rounded-md hover:brightness-90 text-xs">
                получить
              </button>
            ) : (
              <button className="bg-gray-600 text-white/40 font-h1 px-4 py-2 rounded-md cursor-not-allowed text-xs">
                получено
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}